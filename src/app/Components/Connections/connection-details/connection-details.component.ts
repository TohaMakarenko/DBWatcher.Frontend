import {Component, OnInit} from '@angular/core';
import {ConnectionService} from "../../../Services/connection.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Connection} from "../../../Models/connection";
import {ConfirmationService} from "primeng/api";

@Component({
    selector: 'app-connection-details',
    templateUrl: './connection-details.component.html',
    styleUrls: ['./connection-details.component.scss'],
    providers: [ConfirmationService]
})
export class ConnectionDetailsComponent implements OnInit {

    public connection: Connection = this.getNewConnection();


    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private connectionsService: ConnectionService,
        private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            if (params.get('id') == "new") {
                this.connection = this.getNewConnection();
            } else {
                let id = +params.get('id');
                this.getConnection(id);
            }
        });
    }

    private async getConnection(id: number) {
        this.connection = await this.connectionsService.getConnection(id).toPromise();
    }

    onDelete() {
        if (this.connection != null && this.connection.id >= 0)
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete connection?',
                header: 'Delete connection',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    if (this.connection != null && this.connection.id >= 0)
                        await this.connectionsService.deleteConnection(this.connection.id);
                },
                reject: () => {
                }
            });
    };

    async onSave() {
        this.connection = await this.connectionsService.saveConnection(this.connection).toPromise();
    }

    private getNewConnection(): Connection {
        return {
            id: -1,
            name: '',
            server: '',
            login: '',
            password: '',
            isPasswordEncrypted: false
        }
    }

}
