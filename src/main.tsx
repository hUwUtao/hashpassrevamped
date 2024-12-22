import type React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./global.css";
import "preact/debug";
import "virtual:uno.css";

import Loader from "./loader";

const chromeExtensionProtocol = "chrome-extension:";
const chromeExtensionUrl =
	"https://chromewebstore.google.com/detail/hashpass/" +
	"gkmegkoiplibopkmieofaaeloldidnko";
const githubUrl = "https://github.com/stepchowfun/hashpass";

const Main = (): React.ReactElement => {
	if (window.location.protocol === chromeExtensionProtocol) {
		return (
			<div className="m-4">
				<Loader />
			</div>
		);
	}

	return (
		<div className="w-min absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<h1 className="text-2xl text-gray-800">
				<img
					className="relative top-2 left-[-2px] w-9 h-9 border-0 p-0"
					src="images/icon.svg"
					alt="hashpass"
				/>{" "}
				Hashpass!re
			</h1>
			<div>
				<Loader />
			</div>
			<p className="mt-4 leading-4 text-xs text-gray-600">
				Get the Chrome extension{" "}
				<a
					className="text-blue-600 font-semibold hover:text-orange-600 active:text-gray-600"
					href={chromeExtensionUrl}
				>
					{" "}
					here
				</a>
				. You can learn about Hashpass and browse its source code{" "}
				<a
					className="text-blue-600 font-semibold hover:text-orange-600 active:text-gray-600"
					href={githubUrl}
				>
					{" "}
					here
				</a>
				. This website collects no user data and makes no RPC calls.
			</p>
		</div>
	);
};

createRoot(document.body.appendChild(document.createElement("div"))).render(
	<StrictMode>
		<Main />
	</StrictMode>,
);
