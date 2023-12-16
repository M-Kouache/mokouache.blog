---
title: 'What is the event loop in node.js'
excerpt: "Understanding the event loop is essential for writing efficient and scalable Node.js applications. It's the foundation of how Node.js manages asynchronous operations, making it possible to build high-performance applications with a relatively simple programming model."
coverImage: '/assets/blog/event-loop-nodejs/event-loop-cover.png'
date: '2023-08-21T05:35:07.322Z'
author:
  name: Mohamed Kouache
  picture: '/assets/blog/authors/mo.png'
ogImage:
  url: '/assets/blog/event-loop-nodejs/event-loop-cover.png'
---



**No wonder we all agree that Node.js is single-threaded, but how node.js deals with asynchronous operations like network requests and file system. the answer to that question is the `Event Loop`.**

<video width="100%"  controls>
  <source src="/assets/blog/event-loop-nodejs/event-loop-video.mp4" type="video/mp4">
</video>

The event loop is a crucial part of the node.js runtime, allowing it to efficiently handle a large number of concurrent connections without blocking the execution of other code `main-thread`.

The event loop is a continuous loop that Node.js runs to process events and callbacks. It enables Node.js to perform I/O operations asynchronously, which means that instead of waiting for one operation to complete before moving on to the next, it can start multiple operations simultaneously and process them as they complete, this mechanism is achieved by offloading the IO operations  from the call-stack `V8 engine` to the C++ Api `Libuv`, which allows the main thread to execute other synchronous code.

After the libuv is done executing IO operations it queues its callbacks in the event queue, then the event loop waits for the call-stack `main thread` to be empty, then, it moves the callback function from the event queue to call-stack where the javaScript engine lives to be executed.

The event loop consist of  6 phases with the following order :

- **Timers**: This phase checks for callbacks scheduled using **`setTimeout()`** or **`setInterval()`** and executes them if their time has come.
<br>
- **I/O Callbacks**: In this phase, callbacks from completed I/O operations are processed. For example, when a file read operation finishes, its callback is placed in this phase.
<br>
- **Idle, Prepare**: These are internal phases and are generally not something you'll be directly dealing with in typical applications.
<br>
- **Poll**: In this phase, Node.js checks for new I/O events, like incoming data from sockets or new connections. If there are no pending callbacks in this phase, Node.js will wait here.
<br>
- **Check**: This phase is for callbacks related to the setImmediate function. If there are any setImmediate callbacks, they are executed here.
<br>
- **Close Callbacks**: This phase executes close event callbacks, such as the **`close`** event of a socket or a database connection.
<br>
This mechanism allows node.js to execute code with high priority, for example Timer will be executed first on the Timers phase before moving to I/O Callbacks, the event loop also make sure to process micro tasks like nextTick() and promises after each phase.

>when the Poll phase is empty with no I/O callbacks to process and the other phases also empty, the event loop will block waiting for the I/O event, which allows node.js to process I/O operations early (that’s how node.js create a server listening on specific port).
