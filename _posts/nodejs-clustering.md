---
title: 'Scaling node.js apps with clustering'
excerpt: "As a follow-up to the last article about the event loop, let's go deeper into how to scale node.js apps with clustering."
coverImage: '/assets/blog/nodejs-clustering/nodeJs-clustering.png'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Mohamed Kouache
  picture: '/assets/blog/authors/mo.png'
ogImage:
  url: '/assets/blog/nodejs-clustering/nodeJs-clustering.png'
---



That’s why node.js introduced the `cluster module`, 
clustering allows node.js to create multiple instances (workers) of the same Node.js application to take advantage of multi-core processors and improve the application's performance and scalability.<br>

Each node.js process will run on its own core, listening on the same port, 
the master process load balances incoming requests between each  spawned process, 
and the `cluster module` achieves that by implementing the `round-robin` algorithm under the hood

let’s get into how clustering works in node.js in detail, First, we will create a CPU-intensive program without the cluster module, and later on, we will scale the same program with clustering.

First, let’s create a directory named  `node-clustering` :

```bash
$ mkdir node-clustering
```

<br>

Move into the directory :

```bash
$ cd node-clustering
```

<br>

Create an `index.js` file:

```bash
$ touch index.js
```

<br>

Then, initialize the project, which will also create a `package.json` file:

```bash
$ pnpm init
```

<br>

Lastly, let’s install `express` : 

```bash
$ pnpm add express
```

<br>
<br>

# Creating a program without the cluster module

In this step, we will create a simple program containing two routes, `/slow` will start blocking for-loop upon each user’s visit, and `/fast` route which returns a simple response with no blocking logic.

```javascript
const app = require('express')()

const port = 3000

app.get('/slow', (req, res) => {
    for (let i=0; i<5_000_000_000; i++){}
    res.send('Cpu-intensive task on this route')
})

app.get('/fast', (req, res) => {
    res.send('no Cpu-intensive logic on this route')
})

app.listen(port, ()=> console.log(`listening on port ${port}`))
```

<br>

this may not seem like a real-world scenario, but to keep things simple we used long for-loop which simulates the same behavior as a cpu-intensive task.

In your terminal run the program :

```bash
$ node index.js
```

<br>

Then in your browser of choice, let’s hit both routes at the same time :

![slow-route.png](/assets/blog/nodejs-clustering/slow-route.png)

<br>

On route `/slow` the response took approximately `8s`

![fast-route.png](/assets/blog/nodejs-clustering/fast-route.png)


Even though the `/fast` route has no blocking logic it took `6.60s` to load, and that’s because of node.js single-threaded architecture so whenever we have CPU-bound operations the event loop will block until the call stack is done executing the operation.

<br>

# Clustering the same program with the cluster module:

To cluster our node.js program let’s create a new file `cluster.js`, first import the required dependencies :

```javascript
import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";
```

<br>

Second let’s get the Path to `index.js`  where our server lives :

```javascript
const __dirname = dirname(fileURLToPath(import.meta.url));
```

<br>

Third create a variable that holds the number of cores on the current machine :

```javascript
const cpuLength = os.cpus().length;
```

<br>

let’s setup the cluster with the location of our server to run on each core :

```javascript
cluster.setupPrimary({
  exec: __dirname + "/index.js",
});
```

<br>

Create a for loop that start from 0 to less than `cpuLength` which is the number available cores on the machine.

Inside the for let’s fork the program, which means that the cluster module will create a copy of the same program and run it on a diffrent core

```javascript
for (let i = 0; i < cpuLength; i++) {
  cluster.fork();
}
```

<br>

Lastly, if a worker is killed let’s start a new one :

```javascript
cluster.on("exit", (worker, code, signal) => {
  console.log(`worker ${worker.process.pid} is down`);
  cluster.fork();
});
```

<br>

The complete `cluster.js` file should look like this :

```javascript
import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const cpuLength = os.cpus().length;

console.log(`the number of cups on this machine is ${cpuCount}`);
console.log(`the master pid=${process.pid}`);
cluster.setupPrimary({
  exec: __dirname + "/index.js",
});

for (let i = 0; i < cpuLength; i++) {
  cluster.fork();
}
cluster.on("exit", (worker, code, signal) => {
  console.log(`worker ${worker.process.pid} is down`);
  cluster.fork();
});
```

<br>

now on your terminal run the following command :

```bash
node cluster.js

the number of cups on this machine is 4
the master pid=17292
listening on port 3000
listening on port 3000
listening on port 3000
listening on port 3000
```

<br>

After running the program the cluster module creates 4 instances of the same program on each core, My machine has only 4 cores, this may differ for your machine if you have more cores there will be more instances and the cluster module will load balance between them.

Now let’s run the same test as before in your browser of choice, Let’s hit both routes at the same time :

![clustering-slow-route.PNG](/assets/blog/nodejs-clustering/clustering-slow-route.png)

On route `/slow` the response took approximately `11.19s` 

![clustering-fast-route.PNG](/assets/blog/nodejs-clustering/clustering-fast-route.png)

But the `/fast` route now took only `16ms`  and that was because the cluster module loads the request to other available node.js instances without waiting, That’s why clustering in node.js is really important when it comes to CPU-bound operations.
