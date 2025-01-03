import type React from "react";
import { useEffect, useState } from "react";

import UserInterface from "./user-interface";
import fireAndForget from "./fire-and-forget";
import getDomain from "./get-domain";
import getIsPasswordFieldActive from "./get-is-password-field-active";
import { PasswordProvider } from "./secret";

const Loader = (): React.ReactElement | null => {
	const [domain, setDomain] = useState<string | null>(null);
	const [isPasswordFieldActive, setIsPasswordFieldActive] =
		useState<boolean>(false);

	useEffect(() => {
		fireAndForget(
			(async (): Promise<void> => {
				setDomain((await getDomain()) ?? "");
				setIsPasswordFieldActive((await getIsPasswordFieldActive()) ?? false);
			})(),
		);
	}, []);

	return (
		<PasswordProvider>
			<UserInterface
				initialDomain={domain}
				isPasswordFieldActive={isPasswordFieldActive}
			/>
		</PasswordProvider>
	);
};

export default Loader;
