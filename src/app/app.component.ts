import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ScriptInfo} from "./Models/scriptInfo";
import {NavElement} from "./Models/nav-element";
import {Folder} from "./Models/folder";
import {FoldersService} from "./Services/directories.service";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    menuItems: MenuItem[];

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );

    constructor(private breakpointObserver: BreakpointObserver,
                private foldersService: FoldersService) {
    }

    ngOnInit() {
        this.getFolders();
    }

    async getFolders() {
        let directories = await this.foldersService.getFolders().toPromise();
        this.menuItems = [{
            label: "Scripts",
            items: directories.map(x => this.mapDirectoryToNavElement(x))
        }];
    };

    mapDirectoryToNavElement(dir: Folder): MenuItem {
        return {
            label: dir.name,
            //routerLink: ['scripts/dir', dir.name],
            items: dir.scripts.map(s => this.mapScriptToNavElement(s)),
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

    hasChild = (_: number, node: NavElement) => !!node.children && node.children.length > 0;
}
