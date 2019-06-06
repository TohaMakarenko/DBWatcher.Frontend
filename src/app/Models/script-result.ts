import {SqlError} from "./sql-error";

export interface ScriptResult {
    data: any[],
    isSuccess: boolean,
    sqlException: any,
    errors: SqlError[],
    totalCount: number
}
