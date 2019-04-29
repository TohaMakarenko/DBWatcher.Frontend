import {ScriptInfo} from "./scriptInfo";

export interface Folder {
    id: number;
    name: string;
    scripts: ScriptInfo[];
}
