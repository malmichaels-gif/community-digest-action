export interface Config {
    discussionCategory: string;
    sinceDays: number;
    maxPrs: number;
    maxNewContributors: number;
    minActivity: number;
    dryRun: boolean;
    footerStarLink: boolean;
    owner: string;
    repo: string;
}
export interface MergedPR {
    number: number;
    title: string;
    url: string;
    author: string;
    authorUrl: string;
    mergedAt: string;
}
export interface Contributor {
    login: string;
    url: string;
    prNumber: number;
    prTitle: string;
    prUrl: string;
}
export interface DigestData {
    mergedPRs: MergedPR[];
    newContributors: Contributor[];
    periodStart: Date;
    periodEnd: Date;
}
export interface DigestResult {
    posted: boolean;
    activityCount: number;
    discussionUrl?: string;
    markdown?: string;
    skipReason?: string;
}
