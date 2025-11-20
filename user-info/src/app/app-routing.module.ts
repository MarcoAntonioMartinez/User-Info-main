import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInfoComponent } from './user-info/user-info.component';
import { DisplayDataComponent } from './display-data/display-data.component';

const routes: Routes = [
	{
	  path: '',
	  component: UserInfoComponent
	},
	{
	  path: 'display-data',
	  component: DisplayDataComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
