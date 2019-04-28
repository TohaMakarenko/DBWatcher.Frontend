import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ScriptDetailsComponent} from "./Components/Scripts/script-details/script-details.component";
import {ScriptsListComponent} from "./Components/Scripts/scripts-list/scripts-list.component";

const routes: Routes = [
    {path: '', redirectTo: '/scripts', pathMatch: 'full'},
    {path: 'scripts/:id', component: ScriptDetailsComponent},
    {path: 'scripts', component: ScriptsListComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
