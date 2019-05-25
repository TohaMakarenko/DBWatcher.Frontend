import {Parameter} from "./parameter";

export interface Script {
    id: number;
    name: string;
    description: string;
    author: string;
    body: string;
    parameters: Parameter[];
}
