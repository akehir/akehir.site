import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImprintComponent } from './imprint.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ImprintComponent }];

@NgModule({
  declarations: [],
  imports: [ImprintComponent, CommonModule, RouterModule.forChild(routes)],
})
export class ImprintModule {}
