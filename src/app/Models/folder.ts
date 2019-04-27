import {ScriptInfo} from "./scriptInfo";

export class Folder {
    constructor(
        public id: number,
        public name: string,
        public scripts: ScriptInfo[]) {
    };
}
