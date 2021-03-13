import { Client } from 'pg';

import { createTableIfNotExists, generateToken } from './utils';
import { dbConfig } from '../config';

const client = new Client(dbConfig);

export const init = async (): Promise<void> => {
  await client.connect();
  await createTableIfNotExists(client);
};

export const addUrl = async (url: string): Promise<string> => {
  let token: string;
  const res = await client.query('SELECT token FROM urls WHERE url = $1', [ url ]);
  if(res.rowCount > 0) {
    token = res.rows[0].token;
  }
  if(!token) {
    token = generateToken();
    await client.query('INSERT INTO urls(token, url) VALUES($1, $2)', [ token, url ]);
  }
  return token;
};

export const getUrl = async (token: string): Promise<string | undefined> => {
  const res = await client.query('SELECT url FROM urls WHERE token = $1', [ token ]);
  if(res.rowCount > 0) {
    return res.rows[0].url;
  }
  return undefined;
};

export { isValidUrl } from './utils';
