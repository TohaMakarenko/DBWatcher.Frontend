import {Component} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {ScriptInfo} from "./Models/scriptInfo";
import {Folder} from "./Models/folder";
import {FoldersService} from "./Services/folders.service";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    menuItems: MenuItem[] = [];
    displayNewFolderDialog: boolean;
    newFolderName: string;
    subscription: Subscription;

    constructor(private breakpointObserver: BreakpointObserver,
                private foldersService: FoldersService) {
        this.subscription = this.foldersService.getSubject().subscribe(this.updateMenuItems.bind(this));
    }

    ngOnInit() {
        this.loadFolders();
    }

    async loadFolders() {
        this.foldersService.loadFolders();
    };

    updateMenuItems(folders: Folder[]) {
        this.menuItems = [{
            label: "Scripts",
            items: folders.map(x => this.mapDirectoryToNavElement(x)).concat([this.getNewFolderMenuItem()]),
            expanded: true
        }];
    }

    mapDirectoryToNavElement(dir: Folder): MenuItem {
        return {
            label: dir.name,
            //routerLink: ['scripts/dir', dir.name],
            items: dir.scripts.map(s => this.mapScriptToNavElement(s)).concat([this.getNewScriptMenuItem(dir.id)]),
            icon: 'pi pi-fw pi-folder'
        };
    }

    mapScriptToNavElement(script: ScriptInfo): MenuItem {
        return {
            label: script.name,
            routerLink: ['scripts', script.id],
            icon: 'pi pi-fw pi-file'
        }
    }

    getNewScriptMenuItem(directoryId?: number): MenuItem {
        let menuItem: MenuItem = {
            label: "New script",
            routerLink: ["scripts/new"],
            icon: 'pi pi-fw pi-plus'
        };
        if (directoryId != null) {
            menuItem.routerLink.push({directoryId: directoryId});
        }
        return menuItem
    }

    getNewFolderMenuItem(directoryId?: number): MenuItem {
        let menuItem: MenuItem = {
            label: "New folder",
            command: () => this.displayNewFolderDialog = true,
            icon: 'pi pi-fw pi-plus'
        };
        if (directoryId != null) {
            menuItem.queryParams = {directoryId: directoryId}
        }
        return menuItem
    }

    async createFolder() {
        await this.foldersService.insertFolder({
            id: 0,
            name: this.newFolderName,
            scripts: []
        });
        this.displayNewFolderDialog = false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
