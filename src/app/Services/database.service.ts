import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    private controllerUrl: string = '/Database';

    constructor(
        private http: ApiService
    ) {
    }

    getDatabases(connectionId: number): Observable<string[]>{
        return this.http.get(`${this.controllerUrl}/${connectionId}/Databases`);
    }
}
