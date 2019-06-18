import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {ConfirmationService, SelectItem} from "primeng/api";
import {ConnectionService} from "../../../Services/connection.service";
import {DatabaseService} from "../../../Services/database.service";
import {interval, Subscription} from "rxjs";
import {Dashboard} from "../../../Models/dashboard";
import {DashboardService} from "../../../Services/dashboard.service";
import {Connection} from "../../../Models/connection";
import {ChartSettings} from "../../../Models/chart-settings";
import {JobService} from "../../../Services/job.service";
import * as moment from 'moment'
import {SeriesSettings} from "../../../Models/series-settings";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [ConfirmationService]
})
export class DashboardComponent implements OnInit {

    public dashboard: Dashboard = this.getNewDashboard();

    private connectionsSubscription: Subscription;
    public connectionsSelect: SelectItem[];
    public databasesSelect: SelectItem[];
    private _selectedChart: ChartSettings = this.getNewChart();
    public displayChartSettings: boolean;


    private _connection: number;
    private _database: string;

    get connection(): number {
        return this._connection;
    }

    @Input() set connection(value: number) {
        this._connection = value;
        this.databasesSelect = [];
        this.databaseService.getDatabases(value).subscribe(this.updateDatabaseSelectItems.bind(this));
    }

    get database(): string {
        return this._database;
    }

    @Input() set database(value: string) {
        this._database = value;
    }

    get selectedChart(): ChartSettings {
        return this._selectedChart;
    }

    set selectedChart(value: ChartSettings) {
        if (value) {
            this._selectedChart = value;
            let index = this.dashboard.charts.indexOf(value);
            if (index >= 0) {
                this.dashboard.charts[index] = value;
            } else {
                this.dashboard.charts.push(value);
            }
        }
    }

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private confirmationService: ConfirmationService,
        private databaseService: DatabaseService,
        private connectionService: ConnectionService,
        private dashboardService: DashboardService,
        private jobService: JobService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            if (params.get('id') == "new") {
                this.dashboard = this.getNewDashboard();
            } else {
                let id = +params.get('id');
                this.getDashboard(id);
            }
            this.initData();
        });
    }

    private async getDashboard(id: number) {
        this.dashboard = await this.dashboardService.getDashboard(id).toPromise();
    }

    private initData() {
        this.connectionsSubscription = this.connectionService.getSubject().subscribe(this.updateConnectionSelectItems.bind(this));
    }

    updateConnectionSelectItems(connections: Connection[]) {
        this.connectionsSelect = connections.map(c => ({
            value: c.id,
            label: c.name,
            icon: 'pi pi-fw pi-key'
        }));
        if (connections[0]) {
            this.connection = connections[0].id;
        }
    }

    updateDatabaseSelectItems(databases: string[]) {
        this.databasesSelect = databases.map(c => ({
            value: c,
            label: c,
            icon: 'pi pi-fw pi-list'
        }));
        if (databases[0]) {
            this.database = databases[0];
        }
    }

    onDelete() {
        if (this.dashboard != null && this.dashboard.id >= 0)
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete dashboard?',
                header: 'Delete dashboard',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    if (this.connection != null && this.dashboard.id >= 0)
                        await this.dashboardService.deleteDashboard(this.dashboard.id);
                },
                reject: () => {
                }
            });
    };

    onNewChart() {
        this.displayChartSettings = true;
        this._selectedChart = this.getNewChart();
    }

    onConfigChart(chart: ChartSettings) {
        this.displayChartSettings = true;
        this._selectedChart = chart;
    }

    onDeleteChart(chart: ChartSettings) {
        this.dashboard.charts = this.dashboard.charts.filter(x => x != chart);
    }

    loadData() {
        this.dashboard.charts.forEach(chart => {
            this.jobService.searchLogs({connectionId: this.connection, database: this.database, jobId: chart.jobId, skip: 0, take: chart.logLimit})
                .subscribe(res => {
                    chart.data = {
                        labels: res.map(r => this.formatLogTime(r.finishTime)),
                        datasets: chart.series.map(sr => ({
                            label: sr.label,
                            data: res.map(r => r.result.data
                                && r.result.data[0]
                                && r.result.data[0][0]
                                && r.result.data[0][0][sr.column]),
                            backgroundColor: this.getSeriesBackgroundColor(sr),
                            borderColor: sr.color
                        }))
                    }
                })
        })
    }

    getSeriesBackgroundColor(series: SeriesSettings) {
        let alpha = 'FF';
        if (["line", "radar"])
            alpha = '4D';
        return series.color && (series.color + alpha);

    }

    public formatLogTime(time: string): string {
        return moment(time).format("DD.MM.YYYY HH:mm:ss");
    }

    getData(chart: ChartSettings) {
        return {};
    }

    async onSave() {
        this.dashboard = await this.dashboardService.saveDashboard(this.dashboard).toPromise();
    }

    private getNewDashboard(): Dashboard {
        return {
            id: -1,
            name: "",
            charts: [],
        }
    }

    private getNewChart(): ChartSettings {
        return {
            name: "",
            type: "line",
            jobId: 0,
            logLimit: 100,
            series: [],
            updateInterval: 10
        }
    }

}
