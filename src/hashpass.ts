import { Sha256 } from "@aws-crypto/sha256-browser";
import { fromByteArray } from "base64-js";

const rounds = 2 ** 12;

function xorBuffers(buffer1: Uint8Array, buffer2: Uint8Array): Uint8Array {
  const length = Math.min(buffer1.length, buffer2.length);
  const result = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = buffer1[i] ^ buffer2[i];
  }
  return result;
}

function toBase64Url(buffer: Uint8Array): string {
  return fromByteArray(buffer)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function computeSha256(data: Uint8Array): Promise<Uint8Array> {
  const hash = new Sha256();
  hash.update(data);
  return new Uint8Array(await hash.digest());
}

async function iterateSha256(data: Uint8Array, iterations: number): Promise<Uint8Array> {
  let hash = data;
  for (let i = 0; i < iterations; i++) {
    hash = await computeSha256(hash);
  }
  return hash;
}

export default async function hashpass(
  domain: string,
  universalPassword: string,
  username: string,
): Promise<string> {
  const storedPasswordHash = await computeSha256(
    new TextEncoder().encode(universalPassword),
  );
  const usernameHash = new TextEncoder().encode(username.slice(0, 8));
  const domainHash = await computeSha256(
    new TextEncoder().encode(domain.replaceAll(" ", "").toLowerCase()),
  );

  const xorResult = xorBuffers(
    xorBuffers(storedPasswordHash, domainHash),
    usernameHash
  );
  // const xorResultBase64 = fromByteArray(xorResult);

  const combinedHash = new Uint8Array([
    ...(await computeSha256(usernameHash)),
    ...domainHash,
    ...storedPasswordHash,
  ]);

  const iteratedHash = (await iterateSha256(combinedHash, rounds)).slice(0, 16);

  return toBase64Url(new Uint8Array([...xorResult, ...iteratedHash]));
}
