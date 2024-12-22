import hashpass from "./hashpass";
import { test, expect } from "vitest";

test("returns the correct result for empty inputs", async () => {
	expect(await hashpass("", "", "")).toBe("s_vnV7WZpJyqI1tx58Y8ng");
});

const ONE_CORRECT_HASH = "qwciU5Ik3qyQwxNQt9bwBZ4t9bpwUVjL";

test("returns the correct result for an example domain and password", async () => {
	expect(await hashpass("www.example.com", "password", "username")).toBe(
		ONE_CORRECT_HASH,
	);
});

test("strips whitespace from the domain", async () => {
	expect(await hashpass("www.example  .com", "password", "username")).toBe(
		ONE_CORRECT_HASH,
	);
	expect(await hashpass(" www.example.com ", "password", "username")).toBe(
		ONE_CORRECT_HASH,
	);
});

test("does not strip whitespace from the password", async () => {
	expect(await hashpass("www.example.com", "password", "username")).toBe(
		ONE_CORRECT_HASH,
	);
	expect(await hashpass("www.example.com", " password ", "username")).not.toBe(
		ONE_CORRECT_HASH,
	);
});

test("is case-insensitive for domains", async () => {
	expect(await hashpass("www.example.com", "password", "username")).toBe(
		ONE_CORRECT_HASH,
	);
	expect(await hashpass("Www.Example.Com", "password", "username")).toBe(
		ONE_CORRECT_HASH,
	);
});

test("is case-sensitive for passwords", async () => {
	expect(await hashpass("www.example.com", "password", "username")).toBe(
		ONE_CORRECT_HASH,
	);
	expect(await hashpass("www.example.com", "Password", "username")).not.toBe(
		ONE_CORRECT_HASH,
	);
});
