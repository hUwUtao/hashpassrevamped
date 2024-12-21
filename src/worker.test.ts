
import { test, expect } from "vitest";
import { Request, Response } from "./worker-protocol";
import { generatePassword } from "./worker";

test("worker generates the correct password", async () => {
	const request: Request = {
		messageId: 1,
		domain: "www.example.com",
		universalPassword: "password",
		username: "username",
	};

    const fakeResponse = generatePassword(request);

	const expectedResponse: Response = {
		messageId: 1,
		generatedPassword: "K_st6rRJaRTERhLxbHn4Ido-5BAbIG0y", // Expected hash
	};

	const responsePromise = new Promise<Response>((resolve) => {
		resolve(fakeResponse);
	});

	const response = await responsePromise;

	expect(response).toEqual(expectedResponse);
});