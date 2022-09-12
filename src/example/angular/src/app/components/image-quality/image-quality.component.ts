import { Component, Input, OnInit } from '@angular/core'
import { ImageQualityFlags } from 'rppg/dist/lib/RPPGTracker.types'

@Component({
  selector: 'app-image-quality',
  templateUrl: './image-quality.component.html',
  styleUrls: ['./image-quality.component.scss'],
})

export class ImageQualityComponent implements OnInit {
  @Input() imageQualityFlags: ImageQualityFlags

  constructor() { }

  ngOnInit() { }

  get imageQuality() {
    const tmp = {
      ...this.imageQualityFlags,
    }
    delete tmp.faceOrientFlag
    delete tmp.faceSizeFlag
    return Object.values(tmp as ImageQualityFlags).sort((a, b) => b - a)
  }

}
