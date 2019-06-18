export interface JobLogSearchFilter {
    skip?: number;
    take?: number;
    jobId: number;
    connectionId: number;
    database: string;
}
