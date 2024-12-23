import type React from "react";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import "./global.css";
import "preact/debug";
import "virtual:uno.css";

import Loader from "./loader";
import { hydrate, prerender as ssr } from "preact-iso";

const chromeExtensionProtocol = "chrome-extension:";
const chromeExtensionUrl =
	"https://chromewebstore.google.com/detail/hashpass/" +
	"gkmegkoiplibopkmieofaaeloldidnko";
const githubUrl = "https://github.com/stepchowfun/hashpass";

import { useState, useEffect } from "react";

const Main = (): React.ReactElement => {
	const [isChromeExtension, setIsChromeExtension] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined" && window.location.protocol === chromeExtensionProtocol) {
			setIsChromeExtension(true);
		}
	}, []);

	if (isChromeExtension) {
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
					src="/favicon.svg"
					loading="eager"
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
					aria-label="Chrome Web Store"
					target="_blank"
					rel="noopener noreferrer"
				>
					on the Chrome Web Store
				</a>
				. You can learn about Hashpass and browse its source code{" "}
				<a
					className="text-blue-600 font-semibold hover:text-orange-600 active:text-gray-600"
					href={githubUrl}
					aria-label="GitHub repository"
					target="_blank"
					rel="noopener noreferrer"
				>
					on GitHub
				</a>
				. This website collects no user data and makes no RPC calls.
			</p>
		</div>
	);
};

// createRoot(document.body).render(
// 	<StrictMode>
// 		<Main />
// 	</StrictMode>,
// );

if (typeof window !== "undefined") {
	hydrate(<Main />, document.body);
}

export async function prerender(data) {
	const { html, links } = await ssr(<Main />);
	return {
		html,
		links,
		data: { url: data.url },
		head: {
			lang: "en",
			title: "HashpassRe",
			elements: new Set([
				{
					type: "link",
					props: {
						rel: "icon",
						type: "image/svg+xml",
						href: "/favicon.svg",
					},
				},
				{
					type: "link",
					props: {
						rel: "icon",
						href: "/favicon.ico",
					},
				},
				{
					type: "meta",
					props: {
						name: "description",
						content: "A reworked version of Hashpass, stateless password generator.",
					},
				},
			]),
		},
	};
}
