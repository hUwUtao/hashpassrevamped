import execute from "./execute";

export default async function getDomain(): Promise<string | null> {
	if (typeof window === "undefined") {
		return null;
	}
	return await execute((argument: null) => window.location.hostname, null);
}
