import {ChartSettings} from "./chart-settings";

export interface Dashboard {
    id: number;
    name: string;
    charts: ChartSettings[];
}
