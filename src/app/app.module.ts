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
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
    AccordionModule,
    ButtonModule,
    DialogModule,
    GrowlModule,
    InputTextareaModule,
    InputTextModule,
    PanelModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    SidebarModule,
    TabViewModule,
    ToolbarModule
} from 'primeng/primeng';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/components/confirmdialog/confirmdialog';
import {PanelMenuModule} from 'primeng/panelmenu';

//region primeng

//endregion

@NgModule({
    declarations: [
        AppComponent,
        ScriptDetailsComponent,
        ScriptsListComponent,
    ],
    imports: [
        //region primeng

        AccordionModule,
        TabViewModule,
        ProgressSpinnerModule,
        ButtonModule,
        InputTextareaModule,
        InputTextModule,
        PanelModule,
        RadioButtonModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        GrowlModule,
        SidebarModule,
        ToolbarModule,
        PanelMenuModule,

        //endregion

        FontAwesomeModule,

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
