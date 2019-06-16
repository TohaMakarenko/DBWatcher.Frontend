import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JobLog} from "../../../Models/job-log";
import {DbType} from "../../../Models/db-type.enum";

@Component({
    selector: 'app-log-details',
    templateUrl: './log-details.component.html',
    styleUrls: ['./log-details.component.scss']
})
export class LogDetailsComponent implements OnInit {

    private _display: boolean;

    get display(): boolean {
        return this._display;
    }

    @Input() set display(value: boolean) {
        this._display = value;
        this.displayChange.emit(value);
    }

    @Input() log: JobLog;

    @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    onCancelClick() {
        this.display = false;
    }

    getDbType(id: number): string {
        return DbType[id];
    }

    ngOnInit() {
    }

}
