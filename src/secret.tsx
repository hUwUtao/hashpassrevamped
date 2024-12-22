import { createContext, useContext, useState } from "react";
import { computeSha256 } from "./hashpass";
import { fromByteArray } from "base64-js";
// import zxcvbn from "zxcvbn";
import useDebounce from "./debouncelock";

const STORAGE_KEY = "hashedUniversalPassword";

interface PasswordInfo {
	hashedPassword: string;
	passwordPower: number;
	passwordLength: number;
}

const PasswordContext = createContext<{
	passwordInfo: PasswordInfo | null;
	storePassword: (password: string) => Promise<void>;
	clearPassword: () => void;
}>({
	passwordInfo: null,
	storePassword: async () => {},
	clearPassword: () => {},
});

interface PasswordProviderProps {
	children: React.ReactNode;
}

// seperate function to lazy-load zxcvbn (no-blocking, fallback to 0 if not load done)
async function ratePassword(password: string) {
	return (
		(await import("zxcvbn-min")) as { default: typeof import("zxcvbn") }
	).default(password, []).score;
}

export const PasswordProvider: React.FC<PasswordProviderProps> = ({
	children,
}) => {
	const [passwordInfo, setPasswordInfo] = useState<PasswordInfo | null>(() => {
		const storedPassword = localStorage.getItem(STORAGE_KEY);
		return storedPassword ? JSON.parse(storedPassword) : null;
	});

	const debouncedStoreTrigger = useDebounce(
		async () => {
			if (passwordInfo) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(passwordInfo));
			}
		},
		200,
		[passwordInfo],
	);

	const storePassword = async (password: string) => {
		const hashedPassword = await computeSha256(
			new TextEncoder().encode(password),
		);
		const info: PasswordInfo = {
			hashedPassword: fromByteArray(hashedPassword),
			passwordPower: await ratePassword(password),
			passwordLength: password.length,
		};
		setPasswordInfo(info);
		// debouncedStoreTrigger()
	};

	const clearPassword = () => {
		localStorage.removeItem(STORAGE_KEY);
		setPasswordInfo(null);
		// debouncedStoreTrigger()
	};

	return (
		<PasswordContext.Provider
			value={{ passwordInfo, storePassword, clearPassword }}
		>
			{children}
		</PasswordContext.Provider>
	);
};

export const usePassword = () => useContext(PasswordContext);
