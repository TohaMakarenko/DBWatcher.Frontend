import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationComponent} from './Components/navigation/navigation.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule, MatTreeModule} from '@angular/material';
import {HttpClientModule} from "@angular/common/http";
import {ScriptDetailsComponent} from './Components/Scripts/script-details/script-details.component';
import {ScriptsListComponent} from './Components/Scripts/scripts-list/scripts-list.component';
import {MonacoEditorModule} from 'ngx-monaco-editor';


@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        ScriptDetailsComponent,
        ScriptsListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatTreeModule,
        HttpClientModule,
        MonacoEditorModule.forRoot(),
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
