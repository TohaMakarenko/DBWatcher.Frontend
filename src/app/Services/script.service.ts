import {Injectable} from '@angular/core';
import {Script} from "../Models/script";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {ApiService} from "./api.service";
import {ScriptInfo} from "../Models/scriptInfo";

@Injectable({
    providedIn: 'root'
})
export class ScriptService {

    controllerUrl: string = '/scripts';
    private scripts: ScriptInfo[] = [];
    private scriptsSubject: BehaviorSubject<ScriptInfo[]>;

    constructor(private http: ApiService) {
        this.scriptsSubject = new BehaviorSubject<ScriptInfo[]>(this.scripts);
        this.scriptsSubject.subscribe(x => {
            this.scripts = x;
        })
    }

    getSubject(): Subject<ScriptInfo[]> {
        return this.scriptsSubject;
    }

    public loadScripts(fetchFromServer: boolean = true): Subject<ScriptInfo[]> {
        if (fetchFromServer) {
            this.http.get<ScriptInfo[]>(this.controllerUrl).subscribe(dto => {
                this.scriptsSubject.next(dto);
            });
        } else {
            this.updateSubject();
        }
        return this.getSubject();
    }

    public getScript(id: number): Observable<Script> {
        return this.http.get<Script>(`${this.controllerUrl}/${id}`);
    }

    public saveScript(script: Script): Observable<Script> {
        let observable: Observable<Script>;
        if (script.id < 0) {
            observable = this.http.post<Script>(this.controllerUrl, script);
        } else {
            observable = this.http.put<Script>(this.controllerUrl, script);
        }
        observable.subscribe(script => {
            let index = this.scripts.findIndex(s => s.id == script.id);
            if (index > 0)
                this.scripts[index] = script;
            else
                this.scripts.push(script);
            this.updateSubject();
        });
        return observable;
    }

    updateSubject() {
        this.scriptsSubject.next(this.scripts);
    }

}
