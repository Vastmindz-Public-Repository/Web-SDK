import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MeasurementComponent } from './views/measurement/measurement.component'
import { ResultsViewComponent } from './views/results-view/results-view.component'
import { BadConditionsComponent } from './views/bad-conditions/bad-conditions.component'
import { NotSupportedComponent } from './views/not-supported/not-supported.component'

const routes: Routes = [
  { path: '', component: MeasurementComponent },
  { path: 'measurement', component: MeasurementComponent },
  { path: 'results', component: ResultsViewComponent },
  { path: 'bad-conditions', component: BadConditionsComponent },
  { path: 'not-supported', component: NotSupportedComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
