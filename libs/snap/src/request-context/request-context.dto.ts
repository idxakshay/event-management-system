export class RequestContext {
  actor: string;
  email: string;
  originalUrl: string;
  method: string;
  userAgent: string;
  host: string;
  clientIp: string;
  requestId: string;
  userId: number;
  sessionId: string;
  role: string[];
  startTime: number;
}
