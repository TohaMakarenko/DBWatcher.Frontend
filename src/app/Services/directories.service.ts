import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Folder} from "../Models/folder";
import {ScriptInfo} from "../Models/scriptInfo";

@Injectable({
    providedIn: 'root'
})
export class FoldersService {

    constructor() {
    }

    getFolders(): Observable<Folder[]> {
        return of([
            new Folder(1, "Test 1", [new ScriptInfo(1, "Rebuild Index")]),
            new Folder(2, "Test 2", [new ScriptInfo(2, "Get hardware stat")])
        ])
    }
}
