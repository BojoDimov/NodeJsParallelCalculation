import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.on('error', (err) => {
  throw err;
});

server.listen(4000, () => {
  console.log('server bound');
});