import sha256, { Hash } from 'fast-sha256';
import { fromByteArray } from 'base64-js';
import { pbkdf2Sync } from 'pbkdf2';

const rounds = 2 ** 16;

function xorBuffers(buffer1: Uint8Array, buffer2: Uint8Array): Uint8Array {
  const length = Math.min(buffer1.length, buffer2.length);
  const result = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = buffer1[i] ^ buffer2[i];
  }
  return result;
}

export default function hashpass(
  domain: string,
  universalPassword: string,
  username: string,
): string {
  const storedPasswordHash = sha256(new TextEncoder().encode(universalPassword));
  const usernameHash = new TextEncoder().encode(username.slice(0, 8));
  const domainHash = sha256(new TextEncoder().encode(domain.trim().toLowerCase()));

  const xorResult = xorBuffers(storedPasswordHash, usernameHash);
  const xorResultBase64 = fromByteArray(xorResult);

  const combinedHash = new Uint8Array([...sha256(usernameHash), ...domainHash, ...storedPasswordHash]);
  const pbkdf2Result = pbkdf2Sync(combinedHash, 'salt', 1000, 16, 'sha256');

  return xorResultBase64 + fromByteArray(pbkdf2Result);
}
