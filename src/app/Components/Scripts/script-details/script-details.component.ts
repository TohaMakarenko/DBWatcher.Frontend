import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ScriptService} from "../../../Services/script.service";
import {Script} from "../../../Models/script";
import {ActivatedRoute} from "@angular/router";
import {Folder} from "../../../Models/folder";
import {ConfirmationService, SelectItem} from "primeng/api";
import {FoldersService} from "../../../Services/folders.service";
import {Subscription} from "rxjs";
import {DbType} from "../../../Models/db-type.enum";

@Component({
    selector: 'app-script-details',
    templateUrl: './script-details.component.html',
    styleUrls: ['./script-details.component.scss'],
    providers: [ConfirmationService]
})
export class ScriptDetailsComponent implements OnInit {
    @ViewChild('editor') editor;

    public foldersSelect: SelectItem[];
    public script: Script = this.getNewScript();
    public selectedFolder: number = -1;
    public typesSelect: SelectItem[];

    displayExecutionDialog: boolean = false;

    editorOptions = {theme: 'vs-light', language: 'sql'};
    private foldersSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private scriptService: ScriptService,
        private foldersService: FoldersService,
        private confirmationService: ConfirmationService) {
        this.foldersSubscription = this.foldersService.getSubject().subscribe(this.updateSelectItems.bind(this));
        this.typesSelect = Object.keys(DbType).filter(x => isNaN(Number(x)) === false).map(x => ({
            value: x,
            label: DbType[x]
        }))
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            if (params.get('id') == "new") {
                this.script = this.getNewScript();
                this.selectedFolder = +params.get('directoryId');
            } else {
                let id = +params.get('id');
                this.getScript(id);
            }
        });
        this.loadFolders();
    }

    async loadFolders() {
        this.foldersService.loadFolders();
    };

    onDelete() {
        if (this.script != null && this.script.id >= 0)
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete script?',
                header: 'Delete script',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    if (this.script != null && this.script.id >= 0)
                        await this.scriptService.deleteScript(this.script.id);
                },
                reject: () => {
                }
            });
    };

    async onSave() {
        let selectedFolder = this.selectedFolder;
        this.script = await this.scriptService.saveScript(this.script).toPromise();
        await this.foldersService.moveScriptToFolder(selectedFolder, this.script.id);
    }

    async getScript(id: number) {
        this.script = await this.scriptService.getScript(id).toPromise();
        this.updateSelectedFolder();
    }

    onAddParameter() {
        if (!this.script.parameters)
            this.script.parameters = [];
        this.script.parameters.push({
            name: "",
            type: 0,
            value: null
        });
    }

    onRemoveParameter(rowData: any) {
        this.script.parameters = this.script.parameters.filter(x => x.name != rowData.name);
    }

    getNewScript(): Script {
        return {
            id: -1,
            name: '',
            author: '',
            description: '',
            body: '',
            parameters: []
        };
    }

    getDbType(id: number): string {
        return DbType[id];
    }

    updateSelectItems(folders: Folder[]) {
        this.foldersSelect = folders.map(f => ({
            value: f.id,
            label: f.name,
            icon: "pi pi-folder"
        }));
        this.updateSelectedFolder();
    }

    updateSelectedFolder() {
        if (this.script != null && this.script.id >= 0) {
            this.selectedFolder = this.foldersService.getScriptFolder(this.script.id).id;
        }
    }

    onExecute() {
        this.displayExecutionDialog = true;
    }

    onNgDestroy() {
        this.foldersSubscription.unsubscribe();
    }
}
