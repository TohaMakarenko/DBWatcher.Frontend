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

    public Directories: Folder[];
    public TreeControl = new NestedTreeControl<NavElement>(node => node.Children);
    public TreeSource = new MatTreeNestedDataSource<NavElement>();

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

    getDirectories() {
        this.foldersService.getFolders()
            .subscribe(directories => {
                this.TreeSource.data.push(
                    new NavElement("Scripts",
                        ["scripts"],
                        directories.map(x => this.mapDirectoryToNavElement(x))))
            });
    };

    mapDirectoryToNavElement(dir: Folder): NavElement {
        return new NavElement(dir.Name,
            ["scripts/dir", dir.Name],
            dir.Scripts.map(s => this.mapScriptToNavElement(s))
        )
    }

    mapScriptToNavElement(script: ScriptInfo): NavElement {
        return new NavElement(script.Name, ["scripts", script.Id]);
    }

    hasChild = (_: number, node: NavElement) => !!node.Children && node.Children.length > 0;
}
