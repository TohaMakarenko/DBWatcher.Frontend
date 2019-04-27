import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Folder} from "../Models/folder";
import {ScriptInfo} from "../Models/scriptInfo";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";

@Injectable({
    providedIn: 'root'
})
export class FoldersService {

    controllerUrl: string = AppSettings.API_ENDPOINT + '/folders';

    constructor(
        private http: HttpClient,
    ) {
    }

    getFolders(): Observable<Folder[]> {
        return this.http.get<Folder[]>(this.controllerUrl);
        /*return of([
            new Folder(1, "Test 1", [new ScriptInfo(1, "Rebuild Index")]),
            new Folder(2, "Test 2", [new ScriptInfo(2, "Get hardware stat")])
        ])*/
    }
}
