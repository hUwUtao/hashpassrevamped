import { useState, useEffect, useCallback } from "react";

function useDebounce<T extends []>(
	callback: (...args: T) => void,
	delay: number,
	// biome-ignore lint/suspicious/noExplicitAny: vary
	dependenices: any[] = [],
): (...args: T) => void {
	const [debouncedParam, setDebouncedValue] = useState<T | null>(null);

	const debouncedCallback = useCallback((...args: T) => {
		setDebouncedValue(args);
	}, []);

	useEffect(() => {
		if (debouncedParam === null) return;

		const handler = setTimeout(() => {
			callback(...debouncedParam);
			setDebouncedValue(null);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [debouncedParam, delay, callback, ...dependenices]);

	return debouncedCallback;
}

export default useDebounce;
