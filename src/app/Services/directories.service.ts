import {Injectable} from '@angular/core';
import {Folder} from "../Models/folder";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";
import {Observable} from "rxjs";

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
    }
}
