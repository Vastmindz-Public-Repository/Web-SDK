import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MeasurementMeanData } from 'rppg/dist/lib/RPPGEvents.types'
import { SCHEMA } from 'src/consts'
import { translations } from 'src/consts/translations'

export interface ResultData {
  bgrData: MeasurementMeanData,
  isAllDataCalculated: boolean,
  lang: string
}

@Component({
  selector: 'app-results-view',
  templateUrl: './results-view.component.html',
  styleUrls: ['./results-view.component.scss'],
})

export class ResultsViewComponent implements OnInit {
  constructor(
    private router: Router,
  ) { }

  data: ResultData
  messageSent = false
  email = ''
  
  ngOnInit() {
    this.data = history.state.data
    if (!this.data) {
      this.router.navigate(['/'])
      return
    }
  }

  get schema() {
    if (!this.data || !this.data.lang) {
      return []
    }
    return SCHEMA.map(item => ({
      ...item,
      name: translations[this.data.lang][item.key],
    }))
  }

  onBackClickButtonHandler(): void {
    this.router.navigate(['/'])
  }

  trackById(index: number, item: any) {
    return item.key
  }
}
