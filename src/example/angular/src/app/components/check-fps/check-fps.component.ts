import { Component, Input, OnInit } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
@Component({
  selector: 'app-check-fps',
  templateUrl: './check-fps.component.html',
  styleUrls: ['./check-fps.component.scss'],
})

export class CheckFPSComponent implements OnInit{
  @Input() message: string
  @Input() done = false

  constructor(
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show()
  }
}
