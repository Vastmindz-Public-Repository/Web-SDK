import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-not-supported',
  templateUrl: './not-supported.component.html',
  styleUrls: ['./not-supported.component.scss'],
})

export class NotSupportedComponent implements OnInit {
  constructor(
    private router: Router,
  ) { }
  
  ngOnInit() {
  }

  async tryAgainButtonHandler() {
    this.router.navigate(['/'])
  }
}
