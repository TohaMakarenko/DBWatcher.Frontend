import {ScriptResult} from "./script-result";
import {ExecuteScriptDto} from "./execute-script-dto";
import {Observable} from "rxjs";

export interface ExecutionContext {
    id: number,
    state: ExecutionState,
    execution: ExecuteScriptDto,
    result: ScriptResult,
    observable: Observable<ScriptResult>
}

export enum ExecutionState {
    notStarted = 0,
    started = 1,
    finished = 2,
    // execute request errors (not sql exceptions)
    failed = 3
}
