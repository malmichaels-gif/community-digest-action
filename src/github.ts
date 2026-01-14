import { graphql } from '@octokit/graphql';
import type { Config, MergedPR, Contributor, DigestData } from './types.js';

interface PRNode {
  number: number;
  title: string;
  url: string;
  mergedAt: string;
  author: {
    login: string;
    url: string;
  } | null;
}

interface PRResponse {
  repository: {
    pullRequests: {
      nodes: PRNode[];
    };
  };
}

interface ContributorCheckResponse {
  repository: {
    pullRequests: {
      totalCount: number;
    };
  };
}

interface CreateDiscussionResponse {
  createDiscussion: {
    discussion: {
      url: string;
    };
  };
}

export async function fetchDigestData(
  token: string,
  config: Config
): Promise<DigestData> {
  const gql = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });

  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - config.sinceDays);

  const mergedPRs = await fetchMergedPRs(gql, config, periodStart);
  const newContributors = await findNewContributors(gql, config, mergedPRs);

  return {
    mergedPRs: mergedPRs.slice(0, config.maxPrs),
    newContributors: newContributors.slice(0, config.maxNewContributors),
    periodStart,
    periodEnd,
  };
}

async function fetchMergedPRs(
  gql: typeof graphql,
  config: Config,
  since: Date
): Promise<MergedPR[]> {
  const query = `
    query($owner: String!, $repo: String!, $since: DateTime!) {
      repository(owner: $owner, name: $repo) {
        pullRequests(
          first: 100
          states: MERGED
          orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
          nodes {
            number
            title
            url
            mergedAt
            author {
              login
              url
            }
          }
        }
      }
    }
  `;

  const response = await gql<PRResponse>(query, {
    owner: config.owner,
    repo: config.repo,
    since: since.toISOString(),
  });

  return response.repository.pullRequests.nodes
    .filter((pr) => pr.mergedAt && new Date(pr.mergedAt) >= since)
    .map((pr) => ({
      number: pr.number,
      title: pr.title,
      url: pr.url,
      author: pr.author?.login ?? 'ghost',
      authorUrl: pr.author?.url ?? 'https://github.com/ghost',
      mergedAt: pr.mergedAt,
    }));
}

async function findNewContributors(
  gql: typeof graphql,
  config: Config,
  mergedPRs: MergedPR[]
): Promise<Contributor[]> {
  const newContributors: Contributor[] = [];
  const checkedAuthors = new Set<string>();

  for (const pr of mergedPRs) {
    if (checkedAuthors.has(pr.author) || pr.author === 'ghost') {
      continue;
    }
    checkedAuthors.add(pr.author);

    const isFirstTime = await isFirstTimeContributor(
      gql,
      config,
      pr.author,
      pr.mergedAt
    );

    if (isFirstTime) {
      newContributors.push({
        login: pr.author,
        url: pr.authorUrl,
        prNumber: pr.number,
        prTitle: pr.title,
        prUrl: pr.url,
      });
    }
  }

  return newContributors;
}

async function isFirstTimeContributor(
  gql: typeof graphql,
  config: Config,
  author: string,
  mergedAt: string
): Promise<boolean> {
  const query = `
    query($owner: String!, $repo: String!, $author: String!, $before: DateTime!) {
      repository(owner: $owner, name: $repo) {
        pullRequests(
          first: 1
          states: MERGED
          author: $author
        ) {
          totalCount
        }
      }
    }
  `;

  try {
    const response = await gql<ContributorCheckResponse>(query, {
      owner: config.owner,
      repo: config.repo,
      author,
      before: mergedAt,
    });

    // If they have exactly 1 merged PR total, this is their first
    return response.repository.pullRequests.totalCount === 1;
  } catch {
    // If we can't check, assume not first-time
    return false;
  }
}

export async function postDiscussion(
  token: string,
  config: Config,
  title: string,
  body: string
): Promise<string> {
  const gql = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });

  // First, get the repository ID and discussion category ID
  const categoryQuery = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        id
        discussionCategories(first: 25) {
          nodes {
            id
            name
          }
        }
      }
    }
  `;

  const categoryResponse = await gql<{
    repository: {
      id: string;
      discussionCategories: { nodes: Array<{ id: string; name: string }> };
    };
  }>(categoryQuery, {
    owner: config.owner,
    repo: config.repo,
  });

  const category = categoryResponse.repository.discussionCategories.nodes.find(
    (c) => c.name.toLowerCase() === config.discussionCategory.toLowerCase()
  );

  if (!category) {
    throw new Error(
      `Discussion category "${config.discussionCategory}" not found. ` +
        `Available categories: ${categoryResponse.repository.discussionCategories.nodes
          .map((c) => c.name)
          .join(', ')}`
    );
  }

  // Create the discussion
  const createMutation = `
    mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
      createDiscussion(input: {
        repositoryId: $repositoryId
        categoryId: $categoryId
        title: $title
        body: $body
      }) {
        discussion {
          url
        }
      }
    }
  `;

  const createResponse = await gql<CreateDiscussionResponse>(createMutation, {
    repositoryId: categoryResponse.repository.id,
    categoryId: category.id,
    title,
    body,
  });

  return createResponse.createDiscussion.discussion.url;
}
