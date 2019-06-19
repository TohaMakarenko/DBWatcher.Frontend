import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChartSettings} from "../../../Models/chart-settings";
import {SelectItem} from "primeng/api";
import {JobService} from "../../../Services/job.service";
import {Subscription} from "rxjs";
import {Job} from "../../../Models/job";

@Component({
    selector: 'app-chart-settings',
    templateUrl: './chart-settings.component.html',
    styleUrls: ['./chart-settings.component.scss']
})
export class ChartSettingsComponent implements OnInit {

    private _display: boolean;

    public chartTypes: string[] = ["line", "bar", "radar", "pie", "doughnut", "polarArea", "bubble", "scatter"];
    public chartTypesSelect: SelectItem[] = [];
    public jobsSelect: SelectItem[] = [];
    public jobs: Job[] = [];
    public columns: SelectItem[] = [];

    jobsSubscription: Subscription;

    private _chart: ChartSettings = this.getNewChart();
    private _outerChart: ChartSettings;
    private _jobId: number;

    get chart(): ChartSettings {
        return this._chart;
    }

    @Input() set chart(value: ChartSettings) {
        this._chart = Object.assign({}, value);
        this._outerChart = value;
        if (value.jobId <= 0)
            value.jobId = this.jobs && this.jobs[0] && this.jobs[0].id || 0;
        else
            this.jobId = value.jobId;
    }

    get display(): boolean {
        return this._display;
    }

    @Input() set display(value: boolean) {
        this._display = value;
        this.displayChange.emit(value);
    }

    get jobId(): number {
        return this._jobId;
    }

    set jobId(value: number) {
        this._jobId = value;
        this.chart.jobId = value;
        this.loadColumns();
    }

    @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() chartChange: EventEmitter<ChartSettings> = new EventEmitter<ChartSettings>();

    constructor(
        private jobService: JobService
    ) {
        this.jobsSubscription = this.jobService.getSubject().subscribe(this.updateJobSelect.bind(this));
        this.chartTypesSelect = this.chartTypes.map(x => ({
            value: x,
            label: x,
        }))
    }

    ngOnInit() {
        this.jobService.loadJobs();
    }

    updateJobSelect(jobs: Job[]) {
        this.jobs = jobs;
        this.jobsSelect = jobs.map(x => ({
            label: x.name,
            value: x.id
        }));
        if (jobs[0] && !this.jobId) {
            this.jobId = jobs[0].id;
            this.loadColumns();
        }
    }

    async loadColumns() {
        let log = await this.jobService.getLogs(this.jobId, 0, 1).toPromise();
        let data = log && log[0] && log[0].result.data[0];
        let columns = (data && data[0]) ? Object.keys(data[0]) : [];
        this.columns = columns.map(x => ({
            label: x,
            value: x
        }));
    }

    onOkClick() {
        this._chart.jobId = this.jobId;
        Object.assign(this._outerChart, this._chart);
        this.chartChange.emit(this._outerChart);
        this.display = false;
    }

    onCancelClick() {
        this.chartChange.emit(null);
        this.display = false;
    }

    onAddSeries() {
        this.chart.series.push({
            column: this.columns[0] && this.columns[0].value || "", label: "", color: "#787878"
        })
    }

    onRemoveSeries(rowData) {
        this.chart.series = this.chart.series
            .filter(x => x != rowData);
    }

    private getNewChart(): ChartSettings {
        return {
            name: "",
            type: "line",
            jobId: this.jobs && this.jobs[0] && this.jobs[0].id || 0,
            logLimit: 100,
            series: [],
            updateInterval: 10
        }
    }

    ngOnDestroy() {
        this.jobsSubscription && this.jobsSubscription.unsubscribe();
    }
}
