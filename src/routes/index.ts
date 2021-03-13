import express from 'express';
import { json } from 'body-parser';
import path from 'path';

import { baseUrl, port } from '../config';
import { addUrl, getUrl, isValidUrl } from '../services';

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.post('/', json(), async (req, res) => {
  const { url } = req.body;
  if (url) {
    if (isValidUrl(url)) {
      const token = await addUrl(url);
      res.status(200).send({
        link: `${baseUrl}:${port}/${token}`,
      });
      return;
    } else {
      res.status(400).send('Invalid URL');
    }
  } else {
    res.status(400).send('Missing URL');
  }
});

router.get('/:token', async (req, res) => {
  const { token } = req.params;
  if(token === 'favicon.ico') return res.sendStatus(404);
  if(token) {
    const url = await getUrl(token);
    if(url) {
      res.status(301).header({
        Location: url,
      }).send();
    } else {
      res.status(400).send('This shortened URL does not exist.');
    }
  } else {
    res.sendStatus(400);
  }
});

export default router;
