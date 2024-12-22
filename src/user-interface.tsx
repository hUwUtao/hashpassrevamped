import type React from "react";
import { useEffect, useCallback, useRef, useReducer, useState } from "react";

import Input from "./input";
import fillInPassword from "./fill-in-password";
import fireAndForget from "./fire-and-forget";
import hashpass from "./worker-client";
import { Button } from "./button";
import { PasswordProvider, usePassword } from "./secret";
import useDebounce from "./debouncelock";

const debounceMilliseconds = 200;
const copyToClipboardSuccessIndicatorMilliseconds = 1000;

// Remove useStyles and replace with UnoCSS classes
// const useStyles = createUseStyles({
// 	domain: {
// 		color: "#666666",
// 	},
// });

// Define initial state
const initialState = {
	domain: "",
	universalPassword: "",
	universalPasswordPower: 0,
	isUniversalPasswordHidden: true,
	generatedPassword: "",
	isGeneratedPasswordHidden: true,
	username: "",
	updatesInProgress: false,
	pendingCopyToClipboard: false,
	copyToClipboardTimeoutId: null as ReturnType<typeof setTimeout> | null,
	pendingFillInPassword: false,
};

// Define reducer
function reducer(
	state: typeof initialState,
	action: Partial<typeof initialState>,
): typeof initialState {
	return { ...state, ...action };
}

const UserInterface = ({
	initialDomain,
	isPasswordFieldActive,
}: {
	readonly initialDomain: string | null;
	readonly isPasswordFieldActive: boolean;
}): React.ReactElement => {
	// const classes = useStyles();
	const [state, dispatch] = useReducer(reducer, {
		...initialState,
		domain: initialDomain ?? "",
	});
	const domainRef = useRef<HTMLInputElement>(null);
	const universalPasswordRef = useRef<HTMLInputElement>(null);
	const usernameRef = useRef<HTMLInputElement>(null);
	const { passwordInfo, storePassword } = usePassword();
	const prevPasswordRef = useRef<string | null>(null);
	const [once, setOnce] = useState(false);

	useEffect(() => {
		const domainElement = domainRef.current;
		const universalPasswordElement = universalPasswordRef.current;

		if (initialDomain !== null && state.domain === "") {
			dispatch({ domain: initialDomain });

			if (document.activeElement === document.body) {
				if (initialDomain === "") {
					if (domainElement !== null) {
						domainElement.focus();
					}
				} else if (universalPasswordElement !== null) {
					universalPasswordElement.focus();
				}
			}
		}
	}, [state.domain, initialDomain]);

	useEffect(() => {
		if (prevPasswordRef.current !== state.universalPassword) {
			storePassword(state.universalPassword);
			prevPasswordRef.current = state.universalPassword;
		}
	}, [state.universalPassword, storePassword]);

	const fetchGeneratedPassword = useDebounce(async () => {
		const generatedPassword = await hashpass(
			state.domain,
			passwordInfo ? passwordInfo.hashedPassword : state.universalPassword,
			state.username,
		);
		dispatch({ generatedPassword });
	}, debounceMilliseconds);
	// biome-ignore lint/correctness/useExhaustiveDependencies: seperated debouncer
	useEffect(() => {
		fetchGeneratedPassword();
	}, [state.domain, state.universalPassword, state.username]);

	const onResetDomain = useCallback((): void => {
		dispatch({ domain: initialDomain ?? "" });

		const universalPasswordElement = universalPasswordRef.current;

		if (universalPasswordElement !== null) {
			universalPasswordElement.focus();
		}
	}, [initialDomain]);

	const onToggleUniversalPasswordHidden = useCallback((): void => {
		dispatch({ isUniversalPasswordHidden: !state.isUniversalPasswordHidden });

		const universalPasswordElement = universalPasswordRef.current;

		if (universalPasswordElement !== null) {
			universalPasswordElement.focus();
		}
	}, [state.isUniversalPasswordHidden]);

	const onCopyGeneratedPasswordToClipboard = useCallback((): void => {
		dispatch({ pendingCopyToClipboard: true });
	}, []);

	const onToggleGeneratedPasswordHidden = useCallback((): void => {
		dispatch({ isGeneratedPasswordHidden: !state.isGeneratedPasswordHidden });
	}, [state.isGeneratedPasswordHidden]);

	const onFormSubmit = useCallback((event: React.FormEvent): void => {
		event.preventDefault();
		event.stopPropagation();

		dispatch({ pendingFillInPassword: true });
	}, []);

	if (!state.updatesInProgress) {
		if (state.pendingCopyToClipboard) {
			dispatch({ pendingCopyToClipboard: false });

			fireAndForget(
				(async (): Promise<void> => {
					await navigator.clipboard.writeText(state.generatedPassword);

					dispatch({
						copyToClipboardTimeoutId: setTimeout(() => {
							dispatch({ copyToClipboardTimeoutId: null });
						}, copyToClipboardSuccessIndicatorMilliseconds),
					});
				})(),
			);
		}

		if (state.pendingFillInPassword) {
			dispatch({ pendingFillInPassword: false });

			fireAndForget(
				(async (): Promise<void> => {
					await fillInPassword(state.generatedPassword);
					window.close();
				})(),
			);
		}
	}

	return (
		<form onSubmit={onFormSubmit}>
			<Input
				buttons={
					initialDomain === null || state.domain === initialDomain
						? []
						: [
								<Button
									buttonType={{ type: "normal", onClick: onResetDomain }}
									description="Reset the domain."
									imageName="refresh"
									key="refresh"
								/>,
							]
				}
				disabled={false}
				hideValue={false}
				label="Domain"
				monospace={false}
				onChange={(value) => dispatch({ domain: value })}
				placeholder="example.com"
				ref={domainRef}
				updating={false}
				value={state.domain}
			/>
			<Input
				buttons={[
					<Button
						buttonType={{
							type: "normal",
							onClick: onToggleUniversalPasswordHidden,
						}}
						description={
							state.isUniversalPasswordHidden
								? "Show the password."
								: "Hide the password."
						}
						imageName={state.isUniversalPasswordHidden ? "eye-off" : "eye"}
						key="eye"
					/>,
				]}
				focus={true}
				disabled={false}
				hideValue={state.isUniversalPasswordHidden}
				label="Universal password"
				monospace
				onChange={(value) => dispatch({ universalPassword: value })}
				placeholder={
					passwordInfo
						? `Password (length: ${passwordInfo.passwordLength})`
						: ""
				}
				ref={universalPasswordRef}
				updating={false}
				value={state.universalPassword}
				passwordStrength={(0.1 + passwordInfo?.passwordPower) / 4.1}
			/>
			<Input
				buttons={[]}
				disabled={false}
				hideValue={false}
				label="Username"
				monospace={false}
				onChange={(value) => dispatch({ username: value })}
				placeholder="username"
				ref={usernameRef}
				updating={false}
				value={state.username}
			/>
			<Input
				buttons={[
					...(isPasswordFieldActive
						? [
								<Button
									buttonType={{ type: "submit" }}
									description="Fill in the password field and close Hashpass."
									imageName="log-in"
									key="log-in"
								/>,
							]
						: []),
					<Button
						buttonType={
							state.copyToClipboardTimeoutId
								? { type: "noninteractive" }
								: {
										type: "normal",
										onClick: onCopyGeneratedPasswordToClipboard,
									}
						}
						description="Copy the password to the clipboard."
						imageName={
							state.copyToClipboardTimeoutId ? "check" : "clipboard-copy"
						}
						key="clipboard-copy"
					/>,
					<Button
						buttonType={{
							type: "normal",
							onClick: onToggleGeneratedPasswordHidden,
						}}
						description={
							state.isGeneratedPasswordHidden
								? "Show the password."
								: "Hide the password."
						}
						imageName={state.isGeneratedPasswordHidden ? "eye-off" : "eye"}
						key="eye"
					/>,
				]}
				disabled
				hideValue={state.isGeneratedPasswordHidden}
				label={
					state.domain.trim() === "" ? (
						"Password for this domain"
					) : (
						<span>
							Password for <span className="text-gray-600">{state.domain}</span>
						</span>
					)
				}
				monospace
				placeholder="Password"
				onChange={null}
				updating={state.updatesInProgress}
				value={state.generatedPassword}
			/>
			{/* <p>{state.generatedPassword}</p> */}
		</form>
	);
};

export default UserInterface;
