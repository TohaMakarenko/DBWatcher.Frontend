import {Injectable} from '@angular/core';
import {Folder} from "../Models/folder";
import {Observable} from "rxjs";
import {ApiService} from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class FoldersService {

    controllerUrl: string = '/folders';

    constructor(
        private http: ApiService,
    ) {
    }

    getFolders(): Observable<Folder[]> {
        return this.http.get<Folder[]>(this.controllerUrl);
    }
}
