import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Job} from "../Models/job";
import {ApiService} from "./api.service";
import {JobLog} from "../Models/job-log";
import {JobLogSearchFilter} from "../Models/job-log-search-filter";

@Injectable({
    providedIn: 'root'
})
export class JobService {
    controllerUrl: string = '/Jobs';

    private jobs: Job[] = [];
    private readonly jobsSubject: BehaviorSubject<Job[]>;

    constructor(
        private http: ApiService
    ) {
        this.jobsSubject = new BehaviorSubject<Job[]>(this.jobs);
        this.jobsSubject.subscribe(x => {
            this.jobs = x;
        });
    }

    getSubject(): Subject<Job[]> {
        return this.jobsSubject;
    }

    public loadJobs(fetchFromServer: boolean = true): Subject<Job[]> {
        if (fetchFromServer) {
            this.http.get<Job[]>(this.controllerUrl).subscribe(dto => {
                this.jobsSubject.next(dto);
            });
        } else {
            this.updateSubject();
        }
        return this.getSubject();
    }

    public getJob(id: number): Observable<Job> {
        return this.http.get<Job>(`${this.controllerUrl}/${id}`);
    }

    public saveJob(job: Job): Observable<Job> {
        let observable: Observable<Job>;
        if (job.id < 0) {
            observable = this.http.post<Job>(this.controllerUrl, job);
        } else {
            observable = this.http.put<Job>(this.controllerUrl, job);
        }
        observable.subscribe(job => {
            let index = this.jobs.findIndex(s => s.id == job.id);
            if (index >= 0)
                this.jobs[index] = job;
            else
                this.jobs.push(job);
            this.updateSubject();
        });
        return observable;
    }

    public async deleteJob(id: number) {
        await this.http.delete(`${this.controllerUrl}/${id}`).subscribe(x => {
            this.loadJobs();
        });
    }

    public async startJob(id: number) {
        await this.http.post(`${this.controllerUrl}/${id}/start`).subscribe(x => {
            let index = this.jobs.findIndex(s => s.id == id);
            if (index >= 0)
                this.jobs[index].isActive = true;
            this.updateSubject();
        });
    }

    public async stopJob(id: number) {
        await this.http.post(`${this.controllerUrl}/${id}/stop`).subscribe(x => {
            let index = this.jobs.findIndex(s => s.id == id);
            if (index >= 0)
                this.jobs[index].isActive = false;
            this.updateSubject();
        });
    }

    public getLogs(jobId: number, skip: number = 0, take: number = 100): Observable<JobLog[]> {
        return this.http.get<JobLog[]>(`${this.controllerUrl}/${jobId}/log/${skip}/${take}`);
    }

    public searchLogs(filter: JobLogSearchFilter): Observable<JobLog[]> {
        return this.http.post<JobLog[]>(`${this.controllerUrl}/search`, filter);
    }

    updateSubject() {
        this.jobsSubject.next(this.jobs);
    }
}
