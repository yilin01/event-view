import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Session } from './session.model';
import { CONFIG, ExceptionService, MessageService, SpinnerService } from '../../../app/shared';

let sessionsUrl = CONFIG.baseUrls.sessions;

@Injectable()
export class SessionService {
  onDbReset = this.messageService.state;

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private messageService: MessageService,
    private spinnerService: SpinnerService) {
    this.messageService.state.subscribe(state => this.getSessions());
  }

  addSession(session: Session) {
    let body = JSON.stringify(session);
    this.spinnerService.show();
    return <Observable<Session>>this.http
      .post(`${sessionsUrl}`, body)
      .map(res => <Session>res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteSession(session: Session) {
    this.spinnerService.show();
    return <Observable<Session>>this.http
      .delete(`${sessionsUrl}/${session.id}`)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getSessions() {
    this.spinnerService.show();
    return <Observable<Session[]>>this.http
      .get(sessionsUrl)
      .map(res => this.extractData<Session[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  private extractData<T>(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return <T>(body.data || {});
  }

  getSession(id: number) {
    this.spinnerService.show();
    return <Observable<Session>>this.http
      .get(`${sessionsUrl}/${id}`)
      .map(res => this.extractData<Session>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateSession(session: Session) {
    let body = JSON.stringify(session);
    this.spinnerService.show();

    return <Observable<Session>>this.http
      .put(`${sessionsUrl}/${session.id}`, body)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }
}
