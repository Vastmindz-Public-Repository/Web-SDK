import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { CHART_COLOR, CHART_HEIGHT, CHART_WIDTH } from 'src/consts'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})

export class ChartComponent implements OnInit {
  @ViewChild('canvasElement') canvasElementRef: ElementRef<HTMLCanvasElement>
  @Input() signal!: number[]

  canvasCtx: CanvasRenderingContext2D | null = null
  canvasElement: HTMLCanvasElement

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.canvasElement = this.canvasElementRef.nativeElement
    this.canvasCtx = this.canvasElement.getContext('2d')
    this.canvasElement.width = CHART_WIDTH
    this.canvasElement.height = CHART_HEIGHT
    this.canvasCtx.strokeStyle = CHART_COLOR
    this.canvasCtx.lineWidth = 2
    this.canvasCtx.imageSmoothingEnabled = true
  }

  ngOnChanges(changes: any) {
    const signal = changes.signal.currentValue

    let px = -1
    let py = CHART_HEIGHT / 2
    if (!this.canvasCtx || !this.canvasElement) {
      return
    }
    this.canvasCtx.beginPath()
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)

    signal.forEach((y, x) => {
      if (!this.canvasCtx) {
        return
      }
      this.canvasCtx.moveTo(px, py)
      this.canvasCtx.lineTo(x, y)
      px = x
      py = y
    })
    this.canvasCtx.stroke()
  }

}
