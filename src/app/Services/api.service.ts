import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AppSettings} from "../../app-settings";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) {
    }

    public get<T>(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        const url = `${environment.server_url}${path}`;
        return this.http.get<T>(url, {params})
            .pipe(
                map(this.extractData),
                catchError(this.handleError));
    }

    getById<T>(path: string, id: any): Observable<any> {
        const url = `${environment.server_url}${path}/${id}`;
        return this.http.get<T>(url)
            .pipe(
                map(this.extractData),
                catchError(this.handleError));
    }

    public put<T>(path: string, body: Object = {}): Observable<any> {
        const url = `${environment.server_url}${path}`;
        return this.http.put<T>(url, body, AppSettings.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    public post<T>(path: string, body: Object = {}, head: HttpHeaders = new HttpHeaders()): Observable<any> {
        return this.http.post<T>(`${environment.server_url}${path}`, body, AppSettings.httpOptions)
            .pipe(
                map(this.extractData),
                catchError(this.handleError));
    }

    public uploadFile(path: string, file): Observable<HttpEvent<{}>> {
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append('fileItem', file[0], file[0].name);
        const uploadReq = new HttpRequest('POST', `${environment.server_url}${path}`, formData, {
            reportProgress: true,
        });
        return this.http.request(uploadReq);
    }

    public delete(path): Observable<any> {
        return this.http.delete(`${environment.server_url}${path}`, AppSettings.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(error);
    }

    private extractData<T>(res: T): T | {} {
        return res || {};
    }
}
