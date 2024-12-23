export default function fireAndForget(promise: Promise<void>): void {
	// If the promise fails, just log the error and continue.
	promise.catch((e) => {
		if (typeof window === "undefined") return
		window.requestAnimationFrame(() => {
			throw e;
		});
	});
}
