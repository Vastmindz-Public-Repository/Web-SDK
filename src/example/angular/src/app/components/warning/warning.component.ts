import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss'],
})

export class WarningComponent implements OnInit{
  @Input() size = 'normal'
  @Input() message: string

  constructor() { }

  ngOnInit() { }
}
