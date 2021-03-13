import crypto from 'crypto';
import { Client } from 'pg';

const urlRegex = /(((https?:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

export const generateToken = (): string => (
  crypto.randomBytes(16).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
);

export const isValidUrl = (url: string): boolean => (
  urlRegex.test(url)
);

export const createTableIfNotExists = async (client: Client): Promise<void> => {
  const res = await client.query(`
    SELECT EXISTS(
      SELECT * 
      FROM information_schema.tables 
      WHERE 
        table_schema = 'public' AND 
        table_name = 'urls'
    );
  `);
  if(res.rows[0].exists !== 't') {
    await client.query(`
      CREATE TABLE urls (
        token varchar(40) NOT NULL,
        url varchar(500) NOT NULL,
        CONSTRAINT unique_token UNIQUE(token)
      );
    `);
  }
};
