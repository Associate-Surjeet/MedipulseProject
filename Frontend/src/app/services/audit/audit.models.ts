export interface AuditLogDto {
  auditLogId: number;
  userId: string;
  userName?: string;
  userRole?: string;
  httpMethod: string;
  endpoint: string;
  entityType?: string;
  entityId?: string;
  statusCode: number;
  serviceName?: string;
  timestamp: string;
  details?: string;
}

export interface AuditQueryParams {
  userId?: string;
  userRole?: string;
  httpMethod?: string;
  entityType?: string;
  serviceName?: string;
  statusCode?: number;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}
