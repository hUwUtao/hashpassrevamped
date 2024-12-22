import React from "react";
// Remove react-jss import
// import { createUseStyles } from "react-jss";
import { useMemo, forwardRef, useState } from "react";

// Remove labelHeight and inputHeight constants
// const labelHeight = "20px";
// const inputHeight = "28px";

// Remove InputStyleArgs interface
// interface InputStyleArgs {
// 	disabled: boolean;
// 	monospace: boolean;
// 	updating: boolean;
// 	passwordStrength?: number;
// }

// Remove useStyles
// const useStyles = createUseStyles({
// 	container: {
// 		display: "flow-root", // Create a block formatting context to contain margins of descendants.
// 		position: "relative", // Used for positioning `buttonContainer` (below).
// 		width: "320px",
// 		height: "64px",
// 		marginTop: "16px",
// 		border: "2px solid #cccccc",
// 		borderRadius: "8px",
// 		cursor: "text",
// 		overflow: "hidden",
// 		"&:focus-within": {
// 			border: ({ disabled }: InputStyleArgs) =>
// 				disabled ? "2px solid #cccccc" : "2px solid #56b8ff",
// 		},
// 		background: ({ updating }: InputStyleArgs) =>
// 			updating ? "#fafafa" : "transparent",
// 	},
// 	label: {
// 		width: "200px",
// 		height: labelHeight,
// 		margin: "6px 16px 0px 16px",
// 		lineHeight: labelHeight,
// 		fontSize: "12px",
// 		fontWeight: "600",
// 		color: "#999999",
// 		overflow: "hidden",
// 		whiteSpace: "nowrap",
// 		textOverflow: "ellipsis",
// 		cursor: ({ disabled }: InputStyleArgs) => (disabled ? "default" : "text"),
// 		userSelect: "none",
// 	},
// 	input: {
// 		display: "block",
// 		width: "288px",
// 		height: inputHeight,
// 		margin: "0px 16px 6px 16px",
// 		border: "0px",
// 		padding: "0px",
// 		outline: "0px",
// 		background: "transparent",
// 		lineHeight: inputHeight,
// 		fontSize: "16px",
// 		fontFamily: ({ monospace }: InputStyleArgs) =>
// 			monospace
// 				? [
// 						"ui-monospace",
// 						"SFMono-Regular",
// 						"SF Mono",
// 						"Menlo",
// 						"Consolas",
// 						'"Liberation Mono"',
// 						"monospace",
// 					]
// 				: "inherit",
// 		color: "#222222",
// 	},
// 	buttonContainer: {
// 		display: "flex",
// 		position: "absolute", // Overlay on top of `container` (above).
// 		top: "20px",
// 		left: "0px",
// 		width: "316px",
// 		height: "24px",
// 		justifyContent: "flex-end",
// 		paddingRight: "6px",

// 		// Don't steal clicks from `container` (above) [tag:button_container_pointer_events_none].
// 		pointerEvents: "none",
// 	},
// 	passwordStrengthBar: {
// 		position: "absolute",
// 		bottom: "0px",
// 		left: "0px",
// 		width: ({ passwordStrength }: InputStyleArgs) =>
// 			passwordStrength !== undefined ? `${passwordStrength * 100}%` : "0%",
// 		height: "4px",
// 		backgroundColor: "#56b8ff",
// 		transition: "width 0.3s ease",
// 	},
// });

const Input = forwardRef(
	(
		{
			buttons,
			disabled,
			hideValue,
			label,
			monospace,
			onChange,
			placeholder,
			updating,
			value,
			passwordStrength,
			focus,
		}: {
			readonly buttons: React.ReactNode[];
			readonly disabled: boolean;
			readonly hideValue: boolean;
			readonly label: React.ReactNode;
			readonly monospace: boolean;
			readonly onChange: ((value: string) => void) | null;
			readonly placeholder: string;
			readonly updating: boolean;
			readonly value: string;
			readonly passwordStrength?: number;
			readonly focus?: boolean;
		},
		ref: React.ForwardedRef<HTMLInputElement>,
	): React.ReactElement => {
		const [focused, setFocused] = useState(false);
		// Remove useStyles usage
		// const classes = useStyles({
		// 	disabled,
		// 	monospace,
		// 	updating,
		// 	passwordStrength,
		// });
		const newOnChange = useMemo(
			() =>
				(event: React.FormEvent<HTMLInputElement>): void => {
					if (onChange !== null) {
						onChange(event.currentTarget.value);
					}
				},
			[onChange],
		);

		React.useEffect(() => {
			if (focus && ref && "current" in ref && ref.current) {
				ref.current.focus();
			}
		}, [focus, ref]);

		return (
			<label
			className={`flow-root relative w-80 h-16 mt-4 border-2 rounded-lg cursor-text overflow-hidden ${disabled ? "border-gray-300" : "focus-within:border-blue-400"} ${updating ? "bg-gray-100" : "bg-transparent"} ${focused ? "ring-2 ring-blue-400" : "ring-2"}`}
			>
				<div className="w-50 h-5 mt-1.5 mx-4 leading-5 text-xs font-semibold text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis cursor-text select-none">
					{label}
				</div>
				<input
					className={`block w-72 h-7 mx-4 mb-1.5 border-0 p-0 outline-0 bg-transparent leading-7 text-lg ${monospace ? "font-mono" : "font-sans"} text-gray-800`}
					disabled={disabled}
					onChange={newOnChange}
					placeholder={placeholder}
					ref={ref}
					type={hideValue ? "password" : "text"}
					value={value}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
				/>
				<div className="flex absolute top-5 left-0 w-79 h-6 justify-end pr-1.5">
					{buttons}
				</div>
				{passwordStrength !== undefined && (
					<div
						className="absolute bottom-0 left-0 h-1 transition-width duration-300 ease "
						style={{
							width: `${passwordStrength * 100}%`,
							backgroundColor: `color-mix(in lab, red ${100 - passwordStrength * 100}%, green ${passwordStrength * 100}%)`,
						}}
					/>
				)}
			</label>
		);
	},
);

Input.displayName = "Input";

export default Input;
