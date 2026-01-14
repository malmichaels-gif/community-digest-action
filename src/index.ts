import * as core from '@actions/core';
import * as github from '@actions/github';
import { fetchDigestData, postDiscussion } from './github.js';
import { renderDigest, generateTitle, calculateActivityCount } from './digest.js';
import type { Config } from './types.js';

async function run(): Promise<void> {
  try {
    const config = getConfig();
    const token = core.getInput('github_token') || process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error('GitHub token is required');
    }

    core.info(`Fetching digest data for ${config.owner}/${config.repo}...`);
    core.info(`Looking back ${config.sinceDays} days`);

    const data = await fetchDigestData(token, config);
    const activityCount = calculateActivityCount(data);

    core.info(`Found ${data.mergedPRs.length} merged PRs`);
    core.info(`Found ${data.newContributors.length} new contributors`);
    core.info(`Total activity count: ${activityCount}`);

    // Set outputs
    core.setOutput('activity_count', activityCount.toString());

    // Check minimum activity threshold
    if (activityCount < config.minActivity) {
      core.info(
        `Activity count (${activityCount}) is below threshold (${config.minActivity}). Skipping digest.`
      );
      core.setOutput('posted', 'false');
      return;
    }

    const markdown = renderDigest(data, config);
    const title = generateTitle(data.periodEnd);

    if (config.dryRun) {
      core.info('Dry run mode - not posting. Generated markdown:');
      core.info('---');
      core.info(markdown);
      core.info('---');
      core.setOutput('posted', 'false');
      return;
    }

    core.info(`Posting digest to discussion category: ${config.discussionCategory}`);
    const discussionUrl = await postDiscussion(token, config, title, markdown);

    core.info(`Digest posted successfully: ${discussionUrl}`);
    core.setOutput('posted', 'true');
    core.setOutput('discussion_url', discussionUrl);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

function getConfig(): Config {
  const context = github.context;

  return {
    discussionCategory: core.getInput('discussion_category', { required: true }),
    sinceDays: parseInt(core.getInput('since_days') || '7', 10),
    maxPrs: parseInt(core.getInput('max_prs') || '10', 10),
    maxNewContributors: parseInt(core.getInput('max_new_contributors') || '10', 10),
    minActivity: parseInt(core.getInput('min_activity') || '3', 10),
    dryRun: core.getInput('dry_run') === 'true',
    footerStarLink: core.getInput('footer_star_link') !== 'false',
    owner: context.repo.owner,
    repo: context.repo.repo,
  };
}

run();
