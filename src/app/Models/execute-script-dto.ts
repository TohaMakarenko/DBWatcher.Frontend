import {Parameter} from "./parameter";

export interface ExecuteScriptDto {
    connectionId: number;
    database: string;
    scriptId: number;
    params: Parameter[];
}
