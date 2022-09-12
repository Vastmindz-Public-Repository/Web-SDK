import { Injectable } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { of, throwError } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AppService {

  constructor() { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!'
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
      return of<boolean>(false)
    }
    return throwError(errorMessage)
  }

}
