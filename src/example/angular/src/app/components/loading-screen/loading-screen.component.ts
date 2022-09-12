import { Component, OnInit } from '@angular/core'
import { NgxSpinnerService } from "ngx-spinner"

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})

export class LoadingScreenComponent implements OnInit {
  messages = [
    'We’re loading an awesome module onto your device...',
    'Using this, your web browser will turn into a remote monitoring tool...',
    'Using AI, we will be able to understand your physiology...',
    'Please wait. This won’t take long...',
  ]
  step = 0
  delay = 8000
  interval = null

  constructor(
    private spinner: NgxSpinnerService,
  ) { }

  get message() {
    return this.messages[this.step]
  }
  
  ngOnInit() {
    this.spinner.show()
    this.interval = setInterval(() => {
      this.step++
      if (this.step >= this.messages.length) {
        this.step = 0
      }
    }, this.delay)
  }
}
