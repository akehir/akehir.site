import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CurriculumComponent } from './curriculum.component';

const routes: Routes = [{ path: '', component: CurriculumComponent }];

@NgModule({
  declarations: [],
  imports: [CurriculumComponent, CommonModule, RouterModule.forChild(routes)],
})
export class CurriculumModule {}
