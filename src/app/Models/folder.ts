import {ScriptInfo} from "./scriptInfo";

export class Folder {
    constructor(
        public Id: number,
        public Name: string,
        public Scripts: ScriptInfo[]) {
    };
}
