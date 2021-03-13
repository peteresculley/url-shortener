import express from 'express';
import path from 'path';

import { port, baseUrl } from './config';
import routes from './routes';
import { init } from './services';

const app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', routes);

init().then(() => {
  app.listen(port, () => {
    console.log(`Url shortener listening at ${baseUrl}:${port}`);
  });
});
