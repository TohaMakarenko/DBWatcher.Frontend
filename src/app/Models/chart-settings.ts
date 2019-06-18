import {SeriesSettings} from "./series-settings";

export interface ChartSettings {
    name: string;
    type: string;
    jobId: number;
    logLimit: number;
    updateInterval: number;
    series: SeriesSettings[];
    data?: any;
}
