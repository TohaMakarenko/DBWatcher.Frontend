import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Connection} from "../Models/connection";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Script} from "../Models/script";

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    controllerUrl: string = '/ConnectionProperties';

    private connections: Connection[] = [];
    private readonly connectionsSubject: BehaviorSubject<Connection[]>;

    constructor(
        private http: ApiService
    ) {
        this.connectionsSubject = new BehaviorSubject<Connection[]>(this.connections);
        this.connectionsSubject.subscribe(x => {
            this.connections = x;
        });
    }

    getSubject(): Subject<Connection[]> {
        return this.connectionsSubject;
    }

    public loadConnections(fetchFromServer: boolean = true): Subject<Connection[]> {
        if (fetchFromServer) {
            this.http.get<Connection[]>(this.controllerUrl).subscribe(dto => {
                this.connectionsSubject.next(dto);
            });
        } else {
            this.updateSubject();
        }
        return this.getSubject();
    }

    public getConnection(id: number): Observable<Connection> {
        return this.http.get<Connection>(`${this.controllerUrl}/${id}`);
    }

    public saveConnection(connection: Connection): Observable<Connection> {
        let observable: Observable<Connection>;
        if (connection.id < 0) {
            observable = this.http.post<Connection>(this.controllerUrl, connection);
        } else {
            observable = this.http.put<Connection>(this.controllerUrl, connection);
        }
        observable.subscribe(script => {
            let index = this.connections.findIndex(s => s.id == script.id);
            if (index >= 0)
                this.connections[index] = script;
            else
                this.connections.push(script);
            this.updateSubject();
        });
        return observable;
    }

    public async deleteConnection(id: number) {
        await this.http.delete(`${this.controllerUrl}/${id}`).subscribe(x => {
            this.loadConnections();
        });
    }

    updateSubject() {
        this.connectionsSubject.next(this.connections);
    }
}
