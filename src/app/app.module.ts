import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {HttpClientModule} from "@angular/common/http";
import {ScriptDetailsComponent} from './Components/Scripts/script-details/script-details.component';
import {ScriptsListComponent} from './Components/Scripts/scripts-list/scripts-list.component';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {MaterialModule} from "./mat-modules.module";


@NgModule({
    declarations: [
        AppComponent,
        ScriptDetailsComponent,
        ScriptsListComponent
    ],
    imports: [
        MaterialModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        HttpClientModule,
        MonacoEditorModule.forRoot(),
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
