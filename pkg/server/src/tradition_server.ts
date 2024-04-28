import { createServer } from 'node:http';

let counter = 0;

setInterval(() => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0)
  process.stdout.write(`Request rate: ${counter} rq/s`);
  counter = 0;
}, 1000);

const server = createServer((req, res) => {
  counter++;
  const body = 'hello world';
  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
    .end(body);
});

server.on('error', (err) => {
  throw err;
});

server.listen(4000, () => {
  console.log('Server is running!');
});