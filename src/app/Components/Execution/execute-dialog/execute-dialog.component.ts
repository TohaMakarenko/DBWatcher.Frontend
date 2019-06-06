import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Script} from "../../../Models/script";
import {Connection} from "../../../Models/connection";
import {ExecutionService} from "../../../Services/execution.service";
import {ScriptService} from "../../../Services/script.service";
import {ConnectionService} from "../../../Services/connection.service";
import {Subscription} from "rxjs";
import {SelectItem} from "primeng/api";
import {DatabaseService} from "../../../Services/database.service";
import {Parameter} from "../../../Models/parameter";
import {DbType} from "../../../Models/db-type.enum";
import {ExecutionContext, ExecutionState} from "../../../Models/executionContext";
import {ScriptResult} from "../../../Models/script-result";

@Component({
    selector: 'app-execute-dialog',
    templateUrl: './execute-dialog.component.html',
    styleUrls: ['./execute-dialog.component.scss']
})
export class ExecuteDialogComponent implements OnInit {
    private _display: boolean;
    private _script: number;
    private _connection: number;
    private _database: string;
    private _parameters: Parameter[];
    private _result: ScriptResult;
    private _executionContext: ExecutionContext;

    get display(): boolean {
        return this._display;
    }

    get script(): number {
        return this._script;
    }

    get connection(): number {
        return this._connection;
    }

    get database(): string {
        return this._database;
    }

    get parameters(): Parameter[] {
        return this._parameters;
    }

    get result(): ScriptResult {
        return this._result;
    }

    get executionContext(): ExecutionContext {
        return this._executionContext;
    }

    @Input() set display(value: boolean) {
        this._display = value;
        this.displayChange.emit(value);
    }

    @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() set script(value: number) {
        this._script = value;
        this.scriptService.getScript(value).subscribe(x => {
            this.parameters = x.parameters;
        });
    }

    @Input() set connection(value: number) {
        this._connection = value;
        this.databasesSelect = [];
        this.databaseService.getDatabases(value).subscribe(this.updateDatabaseSelectItems.bind(this));
    }

    @Input() set database(value: string) {
        this._database = value;
    }

    @Input() set parameters(value: Parameter[]) {
        this._parameters = value;
    }

    @Input() set result(value: ScriptResult) {
        this._result = value;
        if (value) {
            this.isFinished = true;
        }
    }

    @Input() set executionContext(value: ExecutionContext) {
        if (value) {
            this._executionContext = value;
            this.connection = value.execution.connectionId;
            this.script = value.execution.scriptId;
            this.parameters = value.execution.params;
            this.result = value.result;
            if (value.state == ExecutionState.started)
                this.isStarted = true;
            else if (value.state == ExecutionState.finished)
                this.isFinished = true;
        }
    }

    scriptsSelect: SelectItem[];
    connectionsSelect: SelectItem[];
    databasesSelect: SelectItem[];
    isStarted: boolean = false;
    isFinished: boolean = false;

    scriptsSubscription: Subscription;
    connectionsSubscription: Subscription;
    executionSubscription: Subscription;


    constructor(
        private executionService: ExecutionService,
        private scriptService: ScriptService,
        private connectionService: ConnectionService,
        private databaseService: DatabaseService
    ) {
        this.connectionsSubscription = this.connectionService.getSubject().subscribe(this.updateConnectionSelectItems.bind(this));
        this.scriptsSubscription = this.scriptService.getSubject().subscribe(this.updateScriptSelectItems.bind(this));
    }

    ngOnInit() {
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

    updateScriptSelectItems(scripts: Script[]) {
        this.scriptsSelect = scripts.map(c => ({
            value: c.id,
            label: c.name,
            icon: 'pi pi-fw pi-file'
        }));
        if (this.script > 0 && scripts[0]) {
            this.script = scripts[0].id;
        }
    }

    updateDatabaseSelectItems(databases: string[]) {
        this.databasesSelect = databases.map(c => ({
            value: c,
            label: c,
            icon: 'pi pi-fw pi-list'
        }))
    }

    onExecuteClick() {
        this.executionContext = this.executionService.executeScript(this.connection, this.database, this.script, this.parameters);
        if (this.executionSubscription)
            this.executionSubscription.unsubscribe();
        this.executionContext.observable.subscribe(this.onScriptExecuted.bind(this));
        this.isStarted = true;
    }

    onScriptExecuted(result) {
        this.result = result;
        this.isFinished = true;
    }

    onCancelClick() {
        this.display = false;
    }

    getDbType(id: number): string {
        return DbType[id];
    }

    ngOnDestroy() {
        this.connectionsSubscription.unsubscribe();
        this.scriptsSubscription.unsubscribe();
        if (this.executionSubscription)
            this.executionSubscription.unsubscribe();
    }
}
