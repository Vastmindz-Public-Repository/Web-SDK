import { BrowserModule } from '@angular/platform-browser'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonComponent } from './components/button/button.component'
import { StatusComponent } from './components/status/status.component'
import { LogoComponent } from './components/logo/logo.component'
import { InfoComponent } from './components/info/info.component'
import { ResultsViewComponent } from './views/results-view/results-view.component'
import { ChartComponent } from './components/chart/chart.component'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { MeasurementComponent } from './views/measurement/measurement.component'

import { AppRoutingModule } from './app-routing.module'
import { FooterComponent } from './components/footer/footer.component'
import { NgxSpinnerModule } from "ngx-spinner"
import { WarningComponent } from './components/warning/warning.component'
import { BadConditionsComponent } from './views/bad-conditions/bad-conditions.component'
import { NotSupportedComponent } from './views/not-supported/not-supported.component'
import { CheckFPSComponent } from './components/check-fps/check-fps.component'
import { ImageQualityComponent } from './components/image-quality/image-quality.component'
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component'
import { TextMessageComponent } from './components/text-message/text-message.component'

@NgModule({
  declarations: [
    AppComponent,
    MeasurementComponent,
    ButtonComponent,
    StatusComponent,
    LogoComponent,
    InfoComponent,
    ChartComponent,
    ResultsViewComponent,
    FooterComponent,
    WarningComponent,
    BadConditionsComponent,
    NotSupportedComponent,
    CheckFPSComponent,
    ImageQualityComponent,
    LoadingScreenComponent,
    TextMessageComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    AppRoutingModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
