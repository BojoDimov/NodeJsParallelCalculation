import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  let counter = 0;

  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('message', (worker, message, handle) => {
    if (message === 'req') {
      counter++;
    }
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  setInterval(() => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0)
    process.stdout.write(`Request rate: ${counter} rq/s`);
    counter = 0;
  }, 1000);

} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
    process.send('req');
  }).listen(4000);

  console.log(`Worker ${process.pid} started`);
}