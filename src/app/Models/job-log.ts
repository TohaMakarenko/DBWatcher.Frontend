import {ScriptResult} from "./script-result";
import {JobExecutionContext} from "./job-execution-context";

export interface JobLog {
    jobId: number;
    context: JobExecutionContext;
    startTime: string;
    finishTime: string;
    result: ScriptResult;
}
