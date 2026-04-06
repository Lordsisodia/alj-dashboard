// Round-robin Apify token rotator
// Add tokens as APIFY_API_TOKEN, APIFY_API_TOKEN_2 ... APIFY_API_TOKEN_10

let cursor = 0;

export function getApifyToken(): string {
  const tokens: string[] = [];

  for (let i = 1; i <= 10; i++) {
    const key = i === 1 ? 'APIFY_API_TOKEN' : `APIFY_API_TOKEN_${i}`;
    const val = process.env[key];
    if (val) tokens.push(val);
  }

  if (tokens.length === 0) throw new Error('No APIFY_API_TOKEN configured');

  const token = tokens[cursor % tokens.length];
  cursor = (cursor + 1) % tokens.length;
  return token;
}
