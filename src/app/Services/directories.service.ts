import {Injectable} from '@angular/core';
import {Folder} from "../Models/folder";
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

    getFolders(): Promise<Folder[]> {
        return this.http.get<Folder[]>(this.controllerUrl).toPromise();
        /*return of([
            new Folder(1, "Test 1", [new ScriptInfo(1, "Rebuild Index")]),
            new Folder(2, "Test 2", [new ScriptInfo(2, "Get hardware stat")])
        ])*/
    }
}
