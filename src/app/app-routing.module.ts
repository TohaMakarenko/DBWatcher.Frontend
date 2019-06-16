import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ScriptDetailsComponent} from "./Components/Scripts/script-details/script-details.component";
import {ScriptsListComponent} from "./Components/Scripts/scripts-list/scripts-list.component";
import {ConnectionDetailsComponent} from "./Components/Connections/connection-details/connection-details.component";
import {JobDetailsComponent} from "./Components/Jobs/job-details/job-details.component";

const routes: Routes = [
    {path: '', redirectTo: '/scripts', pathMatch: 'full'},
    {path: 'scripts/:id', component: ScriptDetailsComponent},
    {path: 'scripts/new', component: ScriptDetailsComponent},
    {path: 'scripts', component: ScriptsListComponent},
    {path: 'connections/:id', component: ConnectionDetailsComponent},
    {path: 'connections/new', component: ConnectionDetailsComponent},
    {path: 'jobs/:id', component: JobDetailsComponent},
    {path: 'jobs/new', component: JobDetailsComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
