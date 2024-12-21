import { Sha256 } from "@aws-crypto/sha256-browser";
import { fromByteArray, toByteArray } from "base64-js";
import { pbkdf2 } from "pbkdf2";

const rounds = 2 ** 16;

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

async function computeSha256(data: Uint8Array): Promise<Uint8Array> {
  const hash = new Sha256();
  hash.update(data);
  return new Uint8Array(await hash.digest());
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

  const xorResult = xorBuffers(storedPasswordHash, usernameHash);
  // const xorResultBase64 = fromByteArray(xorResult);

  const combinedHash = new Uint8Array([
    ...(await computeSha256(usernameHash)),
    ...domainHash,
    ...storedPasswordHash,
  ]);

  const pbkdf2Result = await new Promise<Uint8Array>((resolve, reject) => {
    pbkdf2(combinedHash, "salt", rounds, 16, "sha256", (err, derivedKey) => {
      if (err) reject(err);
      else resolve(new Uint8Array(derivedKey));
    });
  });

  return toBase64Url(new Uint8Array([...xorResult, ...pbkdf2Result]));
}
