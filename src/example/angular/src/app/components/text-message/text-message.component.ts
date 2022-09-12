import { Component, Input, OnInit, SimpleChange } from '@angular/core'

export enum ProgressType {
  START = 'start',
  CALIBRATING = 'calibrating',
  CALCULATING = 'calculating'
}

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.scss'],
})

export class TextMessageComponent implements OnInit {
  @Input() progressType: ProgressType = ProgressType.START
  
  constructor() { }

  serviceMessages = [{
    title: 'Get into position',
    description: 'Please ensure your face takes up most of the camera view above',
  }, {
    title: 'Calibrating',
    description: 'Please keep still',
  }]

  messages = [{
    title: 'Extracting your cardiac rhythm',
    description: 'Make sure your face is well lit',
  }, {
    title: 'Analyzing your physiology',
    description: 'This won\'t take long',
  }, {
    title: 'Hang tight',
    description: 'The circles below will indicate when we have values',
  }, {
    title: 'Expanding biometric search',
    description: 'We\'re fetching more physiological metrics',
  }]

  intervalDelay = 5000
  interval = null
  step = 0
  showMessage = true

  classA = null

  message = {
    title: '',
    description: '',
  }

  ngOnInit() { }

  ngOnChanges(changes: { progressType: SimpleChange }) {
    if (changes.progressType.currentValue !== ProgressType.CALCULATING) {
      clearInterval(this.interval)
      this.getMessage()
      return
    }
    if (!this.interval) {
      this.step = 0
      this.getMessage()
      this.interval = setInterval(() => {
        this.step++
        if (this.step >= this.messages.length) {
          this.step = 0
        }
        this.getMessage()
      }, this.intervalDelay)
    }
  }

  getMessage() {
    if (this.progressType === ProgressType.START) {
      this.message = this.serviceMessages[0]
      return
    }
    if (this.progressType === ProgressType.CALIBRATING) {
      this.message = this.serviceMessages[1]
      return
    }

    this.classA = 'out'
    setTimeout(() => {
      this.message = this.messages[this.step]
      this.classA = 'in'
    }, 250)
  }
}
