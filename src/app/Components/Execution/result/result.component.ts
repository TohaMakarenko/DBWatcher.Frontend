import {Component, Input, OnInit} from '@angular/core';
import {ScriptResult} from "../../../Models/script-result";

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

    private _result: ScriptResult;

    get result(): ScriptResult {
        return this._result;
    }

    @Input() set result(value: ScriptResult) {
        this._result = value;
        this.totalCount = 0;
        if (this._result) {
            if (this.result.isSuccess)
                this.prepareSuccess(this._result);
            else
                this.prepareFailed(this._result)
        }
    }

    totalCount: number = 0;
    tables: ResultTable[] = [];
    errors: string[] = [];

    constructor() {
    }

    prepareSuccess(result: ScriptResult) {
        this.totalCount = result.totalCount;
        this.tables = result.data.map(mr => ({
            headers: Object.keys(mr[0] || {}),
            values: mr
        }))
    }

    prepareFailed(result: ScriptResult) {
        this.errors = result.errors.map(err => `Msg ${err.number}, Level ${err.class}, State ${err.state}, Line ${err.lineNumber}:\t${err.message}`)
    }

    ngOnInit() {
    }

}


interface ResultTable {
    headers: string[],
    values: any[]
}
