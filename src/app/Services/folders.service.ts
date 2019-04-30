import {Injectable} from '@angular/core';
import {Folder} from "../Models/folder";
import {Subject} from "rxjs";
import {ApiService} from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class FoldersService {

    controllerUrl: string = '/folders';
    private folders: Folder[] = [];
    private foldersSubject: Subject<Folder[]>;

    constructor(
        private http: ApiService,
    ) {
        this.foldersSubject = new Subject<Folder[]>();
        this.foldersSubject.subscribe(x => {
            this.folders = x;
        });
    }

    getSubject(): Subject<Folder[]> {
        return this.foldersSubject;
    }

    loadFolders(fetchFromServer: boolean = true): Subject<Folder[]> {
        if (fetchFromServer) {
            this.http.get<Folder[]>(this.controllerUrl).subscribe(x => {
                this.foldersSubject.next(x);
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
