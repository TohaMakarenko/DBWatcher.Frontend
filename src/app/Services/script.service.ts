import {Injectable} from '@angular/core';
import {Script} from "../Models/script";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ScriptService {

    controllerUrl: string = AppSettings.API_ENDPOINT + '/scripts';

    constructor(private http: HttpClient) {
    }

    public getScript(id: number): Observable<Script> {
        return this.http.get<Script>(`${this.controllerUrl}/${id}`);
    }

}
