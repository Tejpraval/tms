export interface VersionChange {
    field: string;
    before: unknown;
    after: unknown;
}

export interface VersionDiffResult {
    changes: VersionChange[];
}
