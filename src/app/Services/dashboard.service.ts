import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {ApiService} from "./api.service";
import {Dashboard} from "../Models/dashboard";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

    controllerUrl: string = '/Dashboard';

    private dashboards: Dashboard[] = [];
    private readonly dashboardSubject: BehaviorSubject<Dashboard[]>;

    constructor(
        private http: ApiService
    ) {
        this.dashboardSubject = new BehaviorSubject<Dashboard[]>(this.dashboards);
        this.dashboardSubject.subscribe(x => {
            this.dashboards = x;
        });
    }

    getSubject(): Subject<Dashboard[]> {
        return this.dashboardSubject;
    }

    public loadDashboars(fetchFromServer: boolean = true): Subject<Dashboard[]> {
        if (fetchFromServer) {
            this.http.get<Dashboard[]>(this.controllerUrl).subscribe(dto => {
                this.dashboardSubject.next(dto);
            });
        } else {
            this.updateSubject();
        }
        return this.getSubject();
    }

    public getDashboard(id: number): Observable<Dashboard> {
        return this.http.get<Dashboard>(`${this.controllerUrl}/${id}`);
    }

    public saveDashboard(dashboard: Dashboard): Observable<Dashboard> {
        let observable: Observable<Dashboard>;
        if (dashboard.id < 0) {
            observable = this.http.post<Dashboard>(this.controllerUrl, dashboard);
        } else {
            observable = this.http.put<Dashboard>(this.controllerUrl, dashboard);
        }
        observable.subscribe(dashboard => {
            let index = this.dashboards.findIndex(s => s.id == dashboard.id);
            if (index >= 0)
                this.dashboards[index] = dashboard;
            else
                this.dashboards.push(dashboard);
            this.updateSubject();
        });
        return observable;
    }

    public async deleteDashboard(id: number) {
        await this.http.delete(`${this.controllerUrl}/${id}`).subscribe(x => {
            this.loadDashboars();
        });
    }

    updateSubject() {
        this.dashboardSubject.next(this.dashboards);
    }
}
