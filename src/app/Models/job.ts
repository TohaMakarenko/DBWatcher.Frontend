import {JobExecutionContext} from "./job-execution-context";
import {Parameter} from "./parameter";

export interface Job {
    id: number;
    name: string;
    scriptId: number;
    connectionId: number;
    executionContext: JobExecutionContext;
    parameters: Parameter[];
    type: number;
    cron: string;
    startAt: string;
    interval: string;
    isRepeatable: boolean;
    isActive: boolean;
}
