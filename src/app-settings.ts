import {HttpHeaders} from "@angular/common/http";

export class AppSettings {
    public static API_ENDPOINT: string = "http://localhost:5000/api";
    public static httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'my-auth-token'
        })
    };
}
