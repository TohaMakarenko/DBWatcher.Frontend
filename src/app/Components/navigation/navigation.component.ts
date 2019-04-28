import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FoldersService} from "../../Services/directories.service";
import {Folder} from "../../Models/folder";
import {MatTreeNestedDataSource} from "@angular/material";
import {NavElement} from "./nav-element";
import {NestedTreeControl} from "@angular/cdk/tree";
import {ScriptInfo} from "../../Models/scriptInfo";

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

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
        this.getDirectories();
    }

    async getDirectories() {
        let directories = await this.foldersService.getFolders();
        this.treeSource.data.push(
            new NavElement("scripts",
                ["scripts"],
                directories.map(x => this.mapDirectoryToNavElement(x))));
        this.treeSource.data = this.treeSource.data;
    };

    mapDirectoryToNavElement(dir: Folder): NavElement {
        return new NavElement(dir.name,
            ["scripts/dir", dir.name],
            dir.scripts.map(s => this.mapScriptToNavElement(s))
        )
    }

    mapScriptToNavElement(script: ScriptInfo): NavElement {
        return new NavElement(script.name, ["scripts", script.id]);
    }

    hasChild = (_: number, node: NavElement) => !!node.children && node.children.length > 0;
}
