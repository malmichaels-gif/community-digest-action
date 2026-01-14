import type { Config, DigestData } from './types.js';
export declare function renderDigest(data: DigestData, config: Config): string;
export declare function generateTitle(periodEnd: Date): string;
export declare function calculateActivityCount(data: DigestData): number;
