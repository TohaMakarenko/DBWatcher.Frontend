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
import {DropdownModule} from 'primeng/dropdown';
import { ConnectionDetailsComponent } from './Components/Connections/connection-details/connection-details.component';
import { ExecuteDialogComponent } from './Components/Execution/execute-dialog/execute-dialog.component';
import {TableModule} from "primeng/table";

//region primeng

//endregion

@NgModule({
    declarations: [
        AppComponent,
        ScriptDetailsComponent,
        ScriptsListComponent,
        ConnectionDetailsComponent,
        ExecuteDialogComponent,
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
        DropdownModule,

        //endregion

        FontAwesomeModule,

        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        HttpClientModule,
        MonacoEditorModule.forRoot(),
        FormsModule,
        TableModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
