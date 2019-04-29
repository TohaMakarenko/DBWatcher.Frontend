import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ScriptService} from "../../../Services/script.service";
import {Script} from "../../../Models/script";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-script-details',
    templateUrl: './script-details.component.html',
    styleUrls: ['./script-details.component.scss']
})
export class ScriptDetailsComponent implements OnInit {
    @ViewChild('editor') editor;

    public script: Script = {
        id: -1,
        name: '',
        author: '',
        description: '',
        body: ''
    };
    editorOptions = {theme: 'vs-light', language: 'sql'};

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private scriptService: ScriptService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            let id = +params.get('id');
            this.getScript(id);
        });
    }

    private async getScript(id: number) {
        this.script = await this.scriptService.getScript(id).toPromise();
    }

}

interface SOS {
    a: string,
    b: number
}
