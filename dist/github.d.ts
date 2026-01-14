import type { Config, DigestData } from './types.js';
export declare function fetchDigestData(token: string, config: Config): Promise<DigestData>;
export declare function postDiscussion(token: string, config: Config, title: string, body: string): Promise<string>;
