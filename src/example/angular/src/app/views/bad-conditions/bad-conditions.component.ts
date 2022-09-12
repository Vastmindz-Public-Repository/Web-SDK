import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-bad-conditions',
  templateUrl: './bad-conditions.component.html',
  styleUrls: ['./bad-conditions.component.scss'],
})

export class BadConditionsComponent implements OnInit {
  constructor(
    private router: Router,
  ) { }
  
  ngOnInit() {
  }

  async tryAgainButtonHandler() {
    this.router.navigate(['/measurement'])
  }
}
