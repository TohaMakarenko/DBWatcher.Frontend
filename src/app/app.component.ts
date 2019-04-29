import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatTreeNestedDataSource} from "@angular/material";
import {NestedTreeControl} from "@angular/cdk/tree";
import {ScriptInfo} from "./Models/scriptInfo";
import {NavElement} from "./Models/nav-element";
import {Folder} from "./Models/folder";
import {FoldersService} from "./Services/directories.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public treeControl = new NestedTreeControl<NavElement>(node => node.children);
    public treeSource = new MatTreeNestedDataSource<NavElement>();

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
        this.treeSource.data.push(
            {
                name: 'scripts',
                routerLink: ['scripts'],
                children: directories.map(x => this.mapDirectoryToNavElement(x))
            });
        this.treeSource.data = this.treeSource.data;
    };

    mapDirectoryToNavElement(dir: Folder): NavElement {
        return {
            name: dir.name,
            routerLink: ['scripts/dir', dir.name],
            children: dir.scripts.map(s => this.mapScriptToNavElement(s))
        };
    }

    mapScriptToNavElement(script: ScriptInfo): NavElement {
        return {
            name: script.name,
            routerLink: ['scripts', script.id]
        }
    }

    hasChild = (_: number, node: NavElement) => !!node.children && node.children.length > 0;
}
