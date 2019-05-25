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

@Component({
    selector: 'app-execute-dialog',
    templateUrl: './execute-dialog.component.html',
    styleUrls: ['./execute-dialog.component.scss']
})
export class ExecuteDialogComponent implements OnInit {
    @Input() display: boolean;
    @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    scriptsSelect: SelectItem[];
    connectionsSelect: SelectItem[];
    databasesSelect: SelectItem[];

    @Input() script: number;
    @Input() connection: number;
    @Input() database: string;
    @Input() parameters: Parameter[];

    scriptsSubscription: Subscription;
    connectionsSubscription: Subscription;

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
        if(connections[0])
        {
            this.connection = connections[0].id;
            this.onConnectionChanged(this.connection);
        }
    }

    updateScriptSelectItems(scripts: Script[]) {
        this.scriptsSelect = scripts.map(c => ({
            value: c.id,
            label: c.name,
            icon: 'pi pi-fw pi-file'
        }));
        if(scripts[0])
        {
            this.script = scripts[0].id;
            this.onScriptChanged(this.script);
        }
    }

    updateDatabaseSelectItems(databases: string[]) {
        this.databasesSelect = databases.map(c => ({
            value: c,
            label: c,
            icon: 'pi pi-fw pi-list'
        }))
    }

    onConnectionChanged(connection: number) {
        this.databaseService.getDatabases(connection).subscribe(this.updateDatabaseSelectItems.bind(this));
    }

    onScriptChanged(script: number) {
        this.scriptService.getScript(script).subscribe(x=>{
            this.parameters = x.parameters;
        });
    }

    onExecuteClick() {
        this.executionService.executeScript(this.connection, this.database, this.script, this.parameters);
    }

    onCancelClick() {
        this.changeDisplay(false);
    }

    private changeDisplay(display: boolean) {
        this.display = display;
        this.displayChange.emit(this.display);
    }

    getDbType(id: number): string {
        return DbType[id];
    }

    ngOnDestroy() {
        this.connectionsSubscription.unsubscribe();
        this.scriptsSubscription.unsubscribe();
    }
}
