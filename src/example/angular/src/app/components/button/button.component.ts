import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})

export class ButtonComponent implements OnInit{
  @Input() type = 'primary'
  @Input() size = 'normal'
  @Input() disabled!: boolean
  @Input() spin: boolean

  @Output() onClick = new EventEmitter<MouseEvent>()

  ngOnInit() { }
}
