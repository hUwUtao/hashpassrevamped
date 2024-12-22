import type React from "react";
import { useCallback } from "react";
import "uno.css";

export type ButtonType =
	| { type: "noninteractive" }
	| { type: "normal"; onClick: () => void }
	| { type: "submit" };

export const Button = ({
	buttonType,
	description,
	imageName,
}: {
	readonly buttonType: ButtonType;
	readonly description: string;
	readonly imageName: string;
}): React.ReactElement => {
	const onClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>): void => {
			event.currentTarget.blur();

			if (buttonType.type === "normal") {
				event.preventDefault();
				event.stopPropagation();
				buttonType.onClick();
			}
		},
		[buttonType],
	);

	return (
		<button
			className={`block w-6 h-6 mr-1 border-0 p-0 bg-transparent ${buttonType.type !== "noninteractive" ? "cursor-pointer opacity-25 focus:opacity-100 hover:opacity-100 active:opacity-60" : "cursor-default opacity-100"}`}
			onClick={onClick}
			title={description}
			type={buttonType.type === "submit" ? "submit" : "button"}
		>
			<img className="block w-6 h-6 border-0 p-0" src={`images/${imageName}.svg`} alt={description} />
		</button>
	);
};
