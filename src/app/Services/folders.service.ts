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
    private scripts: Script[] = [];
    private readonly foldersSubject: BehaviorSubject<Folder[]>;

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
                this.scripts = pair.scripts;
                let folders: Folder[] = [{
                    id: -1,
                    name: "All",
                    scripts: pair.scripts
                }];
                folders = folders.concat(pair.folders.map(f => this.mapFolder(f)));
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

    async moveScriptToFolder(folderId: number, scriptId: number) {
        let folder = await this.http.post<FolderDto>(`${this.controllerUrl}/${folderId}/moveScript`, scriptId).toPromise();
        this.loadFolders(); //todo use this.updateFolder(folderId, folder);
        return folder;
    }

    async addScript(folderId: number, scriptId: number): Promise<Folder> {
        let folder = await this.http.post<FolderDto>(`${this.controllerUrl}/${folderId}/addScript`, scriptId).toPromise();
        this.loadFolders(); //todo use this.updateFolder(folderId, folder);
        return folder;
    }

    async removeScript(folderId: number, scriptId: number): Promise<Folder> {
        let folder = await this.http.post<FolderDto>(`${this.controllerUrl}/${folderId}/removeScript`, scriptId).toPromise();
        this.loadFolders(); //todo use this.updateFolder(folderId, folder);
        return folder;
    }

    getScriptFolder(scriptId: number): Folder {
        return this.folders.sort((a, b) => b.id - a.id).find(f => f.scripts.some(s => s.id == scriptId));
    }

    private updateFolder(folderId: number, folder: FolderDto) {
        let index = this.folders.findIndex(f => f.id == folderId);
        this.folders[index] = this.mapFolder(folder);
        this.updateSubject();
    }

    private mapFolder(folder: FolderDto): Folder {
        return {
            id: folder.id,
            name: folder.name,
            scripts: this.scripts.filter(s => folder.scripts.includes(s.id))
        }
    }

    updateSubject() {
        this.foldersSubject.next(this.folders);
    }
}
