import {Injectable} from '@angular/core';
import {Folder} from "../Models/folder";
import {BehaviorSubject, combineLatest, Subject} from "rxjs";
import {ApiService} from "./api.service";
import {ScriptService} from "./script.service";
import {FolderDto} from "../Models/folder-dto";
import {Script} from "../Models/script";

@Injectable({
    providedIn: 'root'
})
export class FoldersService {

    controllerUrl: string = '/folders';
    private folders: Folder[] = [];
    private foldersSubject: BehaviorSubject<Folder[]>;

    constructor(
        private http: ApiService,
        private scriptService: ScriptService
    ) {
        this.foldersSubject = new BehaviorSubject<Folder[]>(this.folders);
        this.foldersSubject.subscribe(x => {
            this.folders = x;
        });
    }

    getSubject(): Subject<Folder[]> {
        return this.foldersSubject;
    }

    loadFolders(fetchFromServer: boolean = true): Subject<Folder[]> {
        if (fetchFromServer) {
            combineLatest(this.http.get<FolderDto[]>(this.controllerUrl),
                this.scriptService.loadScripts(),
                (folders: FolderDto[], scripts: Script[]) => ({folders, scripts})).subscribe(pair => {
                let folders: Folder[] = [{
                    id: -1,
                    name: "All",
                    scripts: pair.scripts
                }];
                folders = folders.concat(pair.folders.map(f => ({
                    id: f.id,
                    name: f.name,
                    scripts: pair.scripts.filter(s => f.scripts.includes(s.id))
                })));
                this.foldersSubject.next(folders);
            });
        } else {
            this.updateSubject();
        }
        return this.getSubject();
    }

    async insertFolder(folder: Folder): Promise<Folder> {
        let newFolder = await this.http.post<Folder>(this.controllerUrl, folder).toPromise();
        this.folders.push(newFolder);
        this.updateSubject();
        return newFolder;
    }

    updateSubject() {
        this.foldersSubject.next(this.folders);
    }
}
