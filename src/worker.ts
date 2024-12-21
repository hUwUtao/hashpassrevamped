import type { Request, Response } from "./worker-protocol";
import hashpass from "./hashpass";

export async function generatePassword(request: Request): Promise<Response> {
  const derivedPassword = await hashpass(request.domain, request.universalPassword, request.username);

  return {
    messageId: request.messageId,
    generatedPassword: derivedPassword,
  };
}

