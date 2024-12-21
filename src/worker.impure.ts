import { generatePassword } from "./worker";
import type { Request } from "./worker-protocol";

self.onmessage = async (event) => {
  const request: Request = event.data;
  const response = await generatePassword(request);
  self.postMessage(response);
};