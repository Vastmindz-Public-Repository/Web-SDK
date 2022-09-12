import { Component, Input, OnInit } from '@angular/core'
import { MeasurementMeanData } from 'rppg/dist/lib/RPPGEvents.types'
import { translations } from 'src/consts/translations'
import { SCHEMA } from 'src/consts/'
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})

export class InfoComponent implements OnInit {
  @Input() processing!: boolean
  @Input() bgrData!: MeasurementMeanData
  @Input() lang!: string

  constructor() { }

  ngOnInit() {}


  get schema() {
    return SCHEMA.map(item => ({
      ...item,
      name: translations[this.lang][item.key],
    }))
  }

  trackById(index: number, item: any) {
    return item.key
}
}
