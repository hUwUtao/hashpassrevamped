import type { Request, Response } from "./worker-protocol";

// Spawn a web worker for offloading password generation to a dedicated thread.
const worker = new Worker(new URL("./worker.ts?worker", import.meta.url), { type: "module" });

// Each message has a unique auto-incrementing identifier.
let nextMessageId = 0;

// Keep track of all in-flight requests so we know what to do with the corresponding responses.
const requests: Record<number, (generatedPassword: string) => void> = {};

// This is the handler for incoming responses.
worker.onmessage = (event: MessageEvent<Response>) => {
	requests[event.data.messageId](event.data.generatedPassword);
	delete requests[event.data.messageId];
};

export default function hashpass(
	domain: string,
	universalPassword: string,
	username: string, // Add username parameter
): Promise<string> {
	return new Promise((resolve, reject) => {
		const request: Request = {
			messageId: nextMessageId,
			domain,
			universalPassword,
			username, // Include username in the request
		};

		requests[nextMessageId] = resolve;

		worker.postMessage(request);

		nextMessageId = (nextMessageId + 1) % Number.MAX_SAFE_INTEGER;
	});
}
