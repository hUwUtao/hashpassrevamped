export interface Request {
  messageId: number;
  domain: string;
  universalPassword: string;
  username: string;
}

export interface Response {
  messageId: number;
  generatedPassword: string;
}
