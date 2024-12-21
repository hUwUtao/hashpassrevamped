// Function to execute a given function in the context of the active tab
export default async function execute<T, U>(
	func: (argument: T) => U,
	argument: T,
): Promise<U | null> {
	// very bad assumptions
	let tab: { id: number; };

	try {
		// Query for the active tab in the current window
		// @ts-ignore
		[tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	} catch (e) {
		// Return null if querying the tab fails
		return null;
	}

	const tabId = tab.id;

	// Return null if tabId is undefined
	if (tabId === undefined) {
		return null;
	}

	let result: chrome.scripting.Awaited<U>;

	try {
		// Execute the provided function in the context of the active tab
		[{ result }] = await chrome.scripting.executeScript({
			target: { tabId },
			func,
			args: [argument],
		});
	} catch (e) {
		// Return null if script execution fails
		return null;
	}

	// Return the result of the executed function
	return result as Promise<U>;
}
