import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {ConfirmationService, SelectItem} from "primeng/api";
import {JobService} from "../../../Services/job.service";
import {Job} from "../../../Models/job";
import {Parameter} from "../../../Models/parameter";
import {interval, Subscription} from "rxjs";
import {ExecutionService} from "../../../Services/execution.service";
import {ScriptService} from "../../../Services/script.service";
import {ConnectionService} from "../../../Services/connection.service";
import {DatabaseService} from "../../../Services/database.service";
import {Connection} from "../../../Models/connection";
import {Script} from "../../../Models/script";
import {DbType} from "../../../Models/db-type.enum";
import {JobType} from "../../../Models/job-type.enum";
import * as moment from 'moment'
import {JobLog} from "../../../Models/job-log";

@Component({
    selector: 'app-job-details',
    templateUrl: './job-details.component.html',
    styleUrls: ['./job-details.component.scss'],
    providers: [ConfirmationService]
})
export class JobDetailsComponent implements OnInit {

    // region properties
    private _script: number;
    private _type: number;
    private _startAt: Date;
    private _parameters: Parameter[];
    public typesSelect: SelectItem[];
    public displayLogDetails: boolean = false;
    public selectedLog: JobLog = null;

    JobType: typeof JobType = JobType;

    get script(): number {
        return this._script;
    }

    get type(): number {
        return this._type;
    }

    get startAt(): Date {
        return this._startAt;
    }

    get parameters(): Parameter[] {
        return this._parameters;
    }

    @Input() set script(value: number) {
        this._script = value;
        this.job.scriptId = value;
        if (value > 0)
            this.scriptService.getScript(value).subscribe(x => {
                this.parameters = x.parameters;
            });
    }

    @Input() set parameters(value: Parameter[]) {
        this._parameters = value;
        this.job.parameters = value;
    }

    @Input() set type(value: number) {
        this._type = value;
        this.job.type = value;
    }

    @Input() set startAt(value: Date) {
        this._startAt = value;
        this.job.startAt = value.toISOString();
    }

    private scriptsSelect: SelectItem[];
    private connectionsSelect: SelectItem[];
    private connections: Connection[];
    private databasesSelect: SelectItem[];
    private scriptsSubscription: Subscription;
    private connectionsSubscription: Subscription;
    private intervalSubscription: Subscription;


    public job: Job = this.getNewJob();
    public logs: JobLog[];

    // endregion

    private setJob(value: Job) {
        this.job = value;
        this.type = value.type;
        this.script = value.scriptId;
        this.parameters = value.parameters;
        this.startAt = moment(value.startAt).toDate();
    }

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private jobService: JobService,
        private confirmationService: ConfirmationService,
        private executionService: ExecutionService,
        private scriptService: ScriptService,
        private connectionService: ConnectionService,
        private databaseService: DatabaseService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            if (params.get('id') == "new") {
                this.setJob(this.getNewJob());
            } else {
                let id = +params.get('id');
                this.getJob(id);
                this.intervalSubscription = interval(5000).subscribe(this.loadLogs.bind(this));
            }
            this.initData();
        });
    }

    private initData() {
        this.typesSelect = Object.keys(JobType).filter(x => isNaN(Number(x)) === false).map(x => ({
            value: parseInt(x),
            label: JobType[x]
        }));

        this.connectionsSubscription = this.connectionService.getSubject().subscribe(this.updateConnectionSelectItems.bind(this));
        this.scriptsSubscription = this.scriptService.getSubject().subscribe(this.updateScriptSelectItems.bind(this));
    }

    private async getJob(id: number) {
        this.setJob(await this.jobService.getJob(id).toPromise());
        this.loadLogs();
    }

    onDelete() {
        if (this.job != null && this.job.id >= 0)
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete job?',
                header: 'Delete Job',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    if (this.job != null && this.job.id >= 0)
                        await this.jobService.deleteJob(this.job.id);
                },
                reject: () => {
                }
            });
    };

    async onSave() {
        this.setJob(await this.jobService.saveJob(this.job).toPromise());
    }

    async onStart() {
        if (this.job != null && this.job.id >= 0)
            this.confirmationService.confirm({
                message: 'Start job?',
                header: 'Start Job',
                icon: 'pi pi-caret-right',
                accept: async () => {
                    if (this.job != null && this.job.id >= 0) {
                        await this.jobService.startJob(this.job.id);
                        this.job.isActive = true;
                    }
                },
                reject: () => {
                }
            });
    }

    async onStop() {
        if (this.job != null && this.job.id >= 0)
            this.confirmationService.confirm({
                message: 'Stop job?',
                header: 'Stop Job',
                icon: 'pi pi-caret-right',
                accept: async () => {
                    if (this.job != null && this.job.id >= 0) {
                        await this.jobService.stopJob(this.job.id);
                        this.job.isActive = false;
                    }
                },
                reject: () => {
                }
            });
    }

    updateConnectionSelectItems(connections: Connection[]) {
        this.connections = connections;
        this.connectionsSelect = connections.map(c => ({
            value: c.id,
            label: c.name,
            icon: 'pi pi-fw pi-key'
        }));
    }

    updateScriptSelectItems(scripts: Script[]) {
        this.scriptsSelect = scripts.map(c => ({
            value: c.id,
            label: c.name,
            icon: 'pi pi-fw pi-file'
        }));
        if (!this.script && !!scripts[0]) {
            this.script = scripts[0].id;
        }
    }

    async getDatabaseSelectItems(rowData: any) {
        let databases = await this.databaseService.getDatabases(rowData.connectionId).toPromise();
        rowData.database = databases[0];
        rowData.databases = databases.map(c => ({
            value: c,
            label: c,
            icon: 'pi pi-fw pi-list'
        }));
    }

    onAddConnection() {
        let conn = {connectionId: 0, database: ""};
        if(this.connectionsSelect[0]){
            conn.connectionId = +this.connectionsSelect[0].value;
            this.getDatabaseSelectItems(conn);
        }
        this.job.executionContexts.push(conn);
    }

    onRemoveConnection(rowData) {
        this.job.executionContexts = this.job.executionContexts
            .filter(x => x.connectionId != rowData.connectionId || x.database != rowData.database);
    }

    private getNewJob(): Job {
        return {
            id: -1,
            connectionId: 0,
            cron: "",
            executionContexts: [],
            interval: "00:00:05",
            isActive: false,
            isRepeatable: false,
            name: "",
            scriptId: 0,
            parameters: [],
            startAt: moment().toString(),
            type: 0
        }
    }

    private async loadLogs() {
        if (!this.job)
            this.logs = [];
        else
            this.logs = await this.jobService.getLogs(this.job.id).toPromise();
    }

    public getConnectionName(id: number) {
        let connection = this.connectionsSelect.find(x => x.value == id);
        return connection.label;
    }

    public formatLogTime(time: string): string{
        return moment(time).format("DD.MM.YYYY HH:mm:ss");
    }

    showLogDetails(log: JobLog) {
        this.selectedLog = log;
        this.displayLogDetails = true;
    }

    getDbType(id: number): string {
        return DbType[id];
    }

    getJobType(id: number): string {
        return JobType[id];
    }

    ngOnDestroy() {
        this.connectionsSubscription.unsubscribe();
        this.scriptsSubscription.unsubscribe();
        this.intervalSubscription.unsubscribe();
    }
}
