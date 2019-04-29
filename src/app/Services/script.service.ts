import {Injectable} from '@angular/core';
import {Script} from "../Models/script";
import {Observable} from "rxjs";
import {ApiService} from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class ScriptService {

    controllerUrl: string = '/scripts';

    constructor(private http: ApiService) {
    }

    public getScript(id: number): Observable<Script> {
        return this.http.get<Script>(`${this.controllerUrl}/${id}`);
    }

    public saveScript(script: Script): Observable<Script> {
        if (script.id < 0) {
            return this.http.post<Script>(this.controllerUrl, script);
        } else {
            return this.http.put<Script>(this.controllerUrl, script);
        }
    }

}
