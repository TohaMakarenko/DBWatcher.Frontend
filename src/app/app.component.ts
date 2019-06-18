import {Component} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {ScriptInfo} from "./Models/scriptInfo";
import {Folder} from "./Models/folder";
import {FoldersService} from "./Services/folders.service";
import {MenuItem} from "primeng/api";
import {ConnectionService} from "./Services/connection.service";
import {Connection} from "./Models/connection";
import {JobService} from "./Services/job.service";
import {Job} from "./Models/job";
import {DashboardService} from "./Services/dashboard.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    menuItems: MenuItem[] = [];
    displayNewFolderDialog: boolean;
    newFolderName: string;
    scriptsSubscription: Subscription;
    connectionsSubscription: Subscription;
    jobsSubscription: Subscription;
    dashboardSubscription: Subscription;

    constructor(private breakpointObserver: BreakpointObserver,
                private foldersService: FoldersService,
                private connectionsService: ConnectionService,
                private jobsService: JobService,
                private dashboardService: DashboardService) {
        this.scriptsSubscription = this.foldersService.getSubject().subscribe(this.updateScriptsMenuItems.bind(this));
        this.connectionsSubscription = this.connectionsService.getSubject().subscribe(this.updateConnectionsMenuItems.bind(this));
        this.jobsSubscription = this.jobsService.getSubject().subscribe(this.updateJobMenuItems.bind(this));
        this.dashboardSubscription = this.dashboardService.getSubject().subscribe(this.updateDashboardMenuItems.bind(this));
    }

    ngOnInit() {
        this.loadData();
    }

    async loadData() {
        this.foldersService.loadFolders();
        this.connectionsService.loadConnections();
        this.jobsService.loadJobs();
        this.dashboardService.loadDashboars();
    };

    // region connections

    updateConnectionsMenuItems(connections: Connection[]) {
        this.menuItems[0] = {
            label: "Connections",
            items: connections.map(x => this.mapConnectionToNavElement(x)).concat([this.getNewConnectionMenuItem()]),
            expanded: true
        };
    }

    mapConnectionToNavElement(con: Connection): MenuItem {
        return {
            label: con.name,
            routerLink: ["connections", con.id],
            icon: "pi pi-fw pi-key"
        }
    }

    getNewConnectionMenuItem(): MenuItem {
        return {
            label: "New connection",
            routerLink: ["connections", "new"],
            icon: "pi pi-fw pi-plus"
        }
    }

    //endregion


    // region scripts

    updateScriptsMenuItems(folders: Folder[]) {
        this.menuItems[1] = {
            label: "Scripts",
            items: folders.map(x => this.mapDirectoryToNavElement(x)).concat([this.getNewFolderMenuItem()]),
            expanded: true
        };
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
            routerLink: ["scripts", "new"],
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

    //endregion

    // region jobs

    updateJobMenuItems(jobs: Job[]) {
        this.menuItems[2] = {
            label: "Jobs",
            items: jobs.map(x => this.mapJobToNavElement(x)).concat([this.getNewJobMenuItem()]),
            expanded: true
        };
    }

    mapJobToNavElement(job: Job): MenuItem {
        return {
            label: job.name,
            routerLink: ["jobs", job.id],
            icon: "pi pi-fw pi-angle-double-right"
        }
    }

    getNewJobMenuItem(): MenuItem {
        return {
            label: "New job",
            routerLink: ["jobs", "new"],
            icon: "pi pi-fw pi-plus"
        }
    }

    //endregion

    // region dashboards

    updateDashboardMenuItems(jobs: Job[]) {
        this.menuItems[3] = {
            label: "Dashboards",
            items: jobs.map(x => this.mapDashboardToNavElement(x)).concat([this.getNewDashboardMenuItem()]),
            expanded: true
        };
    }

    mapDashboardToNavElement(job: Job): MenuItem {
        return {
            label: job.name,
            routerLink: ["dashboards", job.id],
            icon: "pi pi-fw pi-chart-bar"
        }
    }

    getNewDashboardMenuItem(): MenuItem {
        return {
            label: "New dashboard",
            routerLink: ["dashboards", "new"],
            icon: "pi pi-fw pi-plus"
        }
    }

    //endregion

    ngOnDestroy() {
        this.scriptsSubscription.unsubscribe();
    }
}
