import {Injectable} from '@angular/core';
import {ExecutionContext, ExecutionState} from "../Models/executionContext";
import {BehaviorSubject, throwError} from "rxjs";
import {ApiService} from "./api.service";
import {Parameter} from "../Models/parameter";
import {ScriptResult} from "../Models/script-result";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ExecutionService {

    controllerUrl: string = '/Execution';

    executions: ExecutionContext[] = [];
    lastId: number = 0;
    executionsSubject: BehaviorSubject<ExecutionContext[]>;

    constructor(
        private http: ApiService
    ) {
        this.executionsSubject = new BehaviorSubject<ExecutionContext[]>(this.executions);
    }

    executeScript(connectionId: number, database: string, scriptId: number, params: Parameter[] = []): ExecutionContext {
        let execution: ExecutionContext = {
            id: this.getNextId(),
            state: ExecutionState.started,
            execution: {
                connectionId: connectionId,
                database: database,
                scriptId: scriptId,
                params: params
            },
            result: null,
            observable: null
        };

        execution.observable = this.http.post<ScriptResult>(this.controllerUrl + '/Execute', execution.execution)
            .pipe(catchError((err: HttpErrorResponse) => {
                execution.state = ExecutionState.failed;
                return throwError(err);
            }));

        execution.observable.subscribe(result => {
            execution.result = result;
            execution.state = ExecutionState.finished;
            this.updateSubject();
        });
        return execution;
    }

    private getNextId() {
        return this.lastId++;
    }

    private updateSubject() {
        this.executionsSubject.next(this.executions);
    }
}
