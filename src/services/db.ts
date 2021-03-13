import { Client } from 'pg';

import { createTableIfNotExists, generateToken } from './utils';
import { dbConfig } from '../config';

let client = new Client(dbConfig);

export const init = async (): Promise<void> => {
  let success = false;
  while(!success) {
    try {
      await client.connect();
      success = true;
    } catch(err) {
      await client.end();
      client = new Client(dbConfig);
    }
  }
  await createTableIfNotExists(client);
};

export const addUrl = async (url: string): Promise<string> => {
  let token: string;
  const res = await client.query('SELECT token FROM urls WHERE url = $1', [ url ]);
  if(res.rowCount > 0) {
    token = res.rows[0].token;
  }
  if(!token) {
    let foundUnique = false;
    while(!foundUnique) {
      token = generateToken();
      try {
        await client.query('INSERT INTO urls(token, url) VALUES($1, $2)', [ token, url ]);
        foundUnique = true;
      } catch(err) {}
    }
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
