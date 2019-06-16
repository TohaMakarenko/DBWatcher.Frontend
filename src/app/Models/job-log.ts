import {ScriptResult} from "./script-result";

export interface JobLog {
    jobId: number;
    startTime: string;
    finishTime: string;
    result: ScriptResult;
}
