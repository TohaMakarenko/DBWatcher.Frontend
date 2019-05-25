import {ScriptResult} from "./script-result";
import {ExecuteScriptDto} from "./execute-script-dto";

export interface Execution {
    id: number,
    execution: ExecuteScriptDto,
    result: ScriptResult
}
