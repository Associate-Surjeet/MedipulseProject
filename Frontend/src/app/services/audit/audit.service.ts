import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { AuditLogDto, AuditQueryParams, PagedResult } from './audit.models';

const BASE = '/api/audit';
const T = 10_000;

@Injectable({ providedIn: 'root' })
export class AuditService {
  constructor(private http: HttpClient) {}

  getLogs(q: AuditQueryParams = {}): Observable<PagedResult<AuditLogDto>> {
    let p = new HttpParams();
    if (q.userId)      p = p.set('userId', q.userId);
    if (q.userRole)    p = p.set('userRole', q.userRole);
    if (q.httpMethod)  p = p.set('httpMethod', q.httpMethod);
    if (q.entityType)  p = p.set('entityType', q.entityType);
    if (q.serviceName) p = p.set('serviceName', q.serviceName);
    if (q.statusCode)  p = p.set('statusCode', q.statusCode);
    if (q.from)        p = p.set('from', q.from);
    if (q.to)          p = p.set('to', q.to);
    if (q.page)        p = p.set('page', q.page);
    if (q.pageSize)    p = p.set('pageSize', q.pageSize);
    return this.http.get<PagedResult<AuditLogDto>>(BASE, { params: p }).pipe(timeout(T));
  }

  getLog(id: number): Observable<AuditLogDto> {
    return this.http.get<AuditLogDto>(`${BASE}/${id}`).pipe(timeout(T));
  }
}
