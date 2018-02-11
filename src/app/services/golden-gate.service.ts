import { Injectable } from '@angular/core';
import { GoldenGateHttpProvider, RequestBody, ResponseBody, HttpRequest, HttpResponse } from 'goldengate24k';
import { environment } from '../../environments/environment';

@Injectable()
export class GoldenGate implements GoldenGateHttpProvider {
  post<I extends RequestBody, O extends ResponseBody>(request: HttpRequest<I>): Promise<HttpResponse<O>> {
    return fetch(
      environment.http + environment.apiUrl, {
        method: 'POST',
        body: JSON.stringify(request.body),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then(res => res.json())
      .then(res => {
        return <HttpResponse<O>>{
          status: res.status,
          body: res.body
        };
      })
      .catch(error => {
        return <HttpResponse<O>>{
          status: error.status
        };
      });
  }
}
