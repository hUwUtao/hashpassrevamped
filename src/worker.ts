import { pbkdf2 } from "pbkdf2";
import type { Request, Response } from "./worker-protocol";

self.onmessage = async (event) => {
  const request: Request = event.data;

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    pbkdf2(
      request.universalPassword,
      request.domain + request.username,
      1,
      32,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      }
    );
  });

  const response: Response = {
    messageId: request.messageId,
    generatedPassword: derivedKey.toString("hex"),
  };

  self.postMessage(response);
};
