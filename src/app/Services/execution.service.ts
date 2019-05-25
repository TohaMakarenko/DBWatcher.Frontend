import {Injectable} from '@angular/core';
import {Execution} from "../Models/execution";
import {BehaviorSubject} from "rxjs";
import {ApiService} from "./api.service";
import {Parameter} from "../Models/parameter";

@Injectable({
    providedIn: 'root'
})
export class ExecutionService {

    controllerUrl: string = '/Execution';

    executions: Execution[] = [];
    lastId: number = 0;
    executionsSubject: BehaviorSubject<Execution[]>;

    constructor(
        private http: ApiService
    ) {
        this.executionsSubject = new BehaviorSubject<Execution[]>(this.executions);
    }

    executeScript(connectionId: number, database: string, scriptId: number, params: Parameter[] = []): Execution {
        let execution: Execution = {
            id: this.getNextId(),
            execution: {
                connectionId: connectionId,
                database: database,
                scriptId: scriptId,
                params: params
            },
            result: null
        };
        this.executeScriptInternal(execution);
        return execution;
    }

    private executeScriptInternal(execution: Execution) {
        this.http.post(this.controllerUrl + '/Execute', execution.execution)
            .subscribe(result => {
                execution.result = result;
                this.updateSubject();
            })
    }

    private getNextId() {
        return this.lastId++;
    }

    private updateSubject() {
        this.executionsSubject.next(this.executions);
    }
}
