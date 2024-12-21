import pbkdf2 from 'pbkdf2';
import type { Request, Response } from './worker-protocol';

self.onmessage = (event) => {
  const request: Request = event.data;

  const response: Response = {
    messageId: request.messageId,
    generatedPassword: pbkdf2.pbkdf2Sync(request.universalPassword, request.domain + request.username, 1, 32, 'sha512').toString('hex'),
  };

  self.postMessage(response);
};
