---
title: 'Multithreading in node.js with worker threads'
excerpt: "When it comes to dealing with CPU-intensive operations in node.js, we all agree that there are only three ways to do it either “cluster module”, “child process” or “worker threads”. in this article, we will see how to do CPU-bound operations with worker threads"
coverImage: '/assets/blog/worker-threads-nodejs/worker-threads-cover.png'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Mohamed Kouache
  picture: '/assets/blog/authors/mo.png'
ogImage:
  url: '/assets/blog/worker-threads-nodejs/worker-threads-cover.png'
---


When it comes to dealing with CPU-intensive operations in node.js, we all agree that there are only three ways to do it either `cluster module`, `child process` or <br> `worker threads` . <br> <br> in this article, we will see how to do CPU-bound operations with worker threads

## What are Worker Threads?

Worker threads are a feature in Node.js that allows developers to run JavaScript code in parallel, taking advantage of multi-core systems. Unlike the traditional single-threaded approach, worker threads enable the execution of multiple tasks concurrently, improving application performance and responsiveness.

## When to Use Worker Threads?

Worker threads are particularly beneficial for CPU-intensive tasks that would otherwise block the event loop in a single-threaded environment. Examples include complex mathematical computations, image processing, or any operation that requires significant processing power.

## Implementing Worker Threads

Let's dive into the practical aspects of using worker threads in Node.js with a step-by-step example.

Import the `worker-threads` module:

```jsx
const { Worker, isMainThread, parentPort } = require('worker_threads');
```

Check if the code is running in the main thread:

```jsx
if (isMainThread) {
  // Code for the main thread
  const worker = new Worker(__filename);
} else {
  // Code for the worker thread
  parentPort.postMessage('Hello from the worker thread!');
}

```

Communication between main thread and worker thread

```jsx
// In the main thread
worker.on('message', (message) => {
  console.log(`Message from worker: ${message}`);
});

// In the worker thread
parentPort.postMessage('Hello from the main thread!');
```
<br>
<br>

## Real-World Example: image processing with worker threads:

Let's apply worker threads to a real-world scenario - image processing.

```bash
pnpm init
```

Install the 'sharp' module

```bash
pnpm add sharp
```

Implement image processing logic

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');
const sharp = require('sharp');

if (isMainThread) {
  const imageWorker = new Worker(__filename);
  const imagePath = 'path/to/your/image.jpg';

  // Send the image path to the worker thread
  imageWorker.postMessage(imagePath);

  // Receive the processed image from the worker thread
  imageWorker.on('message', (processedImagePath) => {
    console.log(`image saved at: ${processedImagePath}`);
  });
} else {
  parentPort.on('message', (imagePath) => {
    // Perform image processing
    const processedImagePath = `path/to/processed/${Date.now()}_processed.jpg`;

    sharp(imagePath)
      .resize(300, 200)
      .toFile(processedImagePath, (err) => {
        if (err) throw err;

        // Send the processed image path back to the main thread
        parentPort.postMessage(processedImagePath);
      });
  });
}
```
<br>

## Conclusion

Worker threads are like extra helpers for your Node.js applications. They can handle complex tasks without blocking the event loop, making your applications faster and more responsive. So, if you're building apps that involve heavy calculations or image processing, worker threads are your new best friends!
