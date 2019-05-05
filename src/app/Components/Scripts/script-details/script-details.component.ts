import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ScriptService} from "../../../Services/script.service";
import {Script} from "../../../Models/script";
import {ActivatedRoute} from "@angular/router";
import {Folder} from "../../../Models/folder";

@Component({
    selector: 'app-script-details',
    templateUrl: './script-details.component.html',
    styleUrls: ['./script-details.component.scss']
})
export class ScriptDetailsComponent implements OnInit {
    @ViewChild('editor') editor;

    public script: Script = this.getNewScript();
    public folder: Folder;
    editorOptions = {theme: 'vs-light', language: 'sql'};

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private scriptService: ScriptService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            if (params.get('id') == "new") {
                this.script = this.getNewScript();
            } else {
                let id = +params.get('id');
                this.getScript(id);
            }
        });
    }

    public onDelete;

    public async onSave() {
        this.script = await this.scriptService.saveScript(this.script).toPromise();
    }

    private async getScript(id: number) {
        this.script = await this.scriptService.getScript(id).toPromise();
    }

    private getNewScript(): Script {
        return {
            id: -1,
            name: '',
            author: '',
            description: '',
            body: ''
        };
    }

    onNgDestroy() {

    }
}
