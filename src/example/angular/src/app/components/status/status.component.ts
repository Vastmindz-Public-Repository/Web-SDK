import { Component, Input, OnInit } from '@angular/core'
import { translations } from 'src/consts/translations'
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})

export class StatusComponent implements OnInit {
  @Input() lang!: string

  constructor() { }

  ngOnInit() { }

  get status() {
    return translations[this.lang]['status'] || ''
  }
}
