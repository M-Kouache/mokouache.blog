---
title: 'WebRTC and getUserMedia API: A Step-by-Step Guide'
excerpt: "In WebRTC (Web Real-Time Communication), the getUserMedia API is used to access a user's camera and microphone. It allows you to capture audio and video from the user's device for use in real-time communication applications, such as video conferencing and web streaming."
coverImage: '/assets/blog/webrtc-part-two-getusermedia/cover.png'
date: '2024-01-28T05:35:07.322Z'
author:
  name: Mohamed Kouache
  picture: '/assets/blog/authors/mo.png'
ogImage:
  url: '/assets/blog/webrtc-part-two-getusermedia/cover.png'
---




Based on the article from the [Chrome blog](https://blog.chromium.org/2012/07/introducing-getusermedia-and-javascript.html), the [getUserMedia API](http://www.html5rocks.com/en/tutorials/getusermedia/intro/) lets users grant web apps access to their camera and microphone without a plug-in. This is the first step in enabling high-quality video and audio communication as part of WebRTC, a powerful new real-time communications standard for the open web platform, In this step-by-step guide, we'll explore how to use WebRTC's `getUserMedia` API to capture audio and video from a user's device.

But before getting into any technical details we should know that the journey to `getUserMedia()` wasn't always smooth. Back in the day, many rushed to create their own "Media Capture APIs," leading to chaos. The W3C stepped in with the DAP Working Group to tame the wild west of proposals and establish order.

Here's a brief history of the getUserMedia API in HTML:

### **HTML Media Capture**

- Before the official getUserMedia API, the HTML Media Capture specification was introduced.
- It allowed users to capture media (such as photos or videos) using input elements with the **`capture`** attribute.

```jsx
<input type="file" accept="image/*" capture="camera">
```

### **A unified approach**

In 2011, the World Wide Web Consortium (W3C) took the initiative to standardize media capture with the proposal of the `getUserMedia` API. This API aimed to provide a consistent and cross-browser way to access user's media devices. Initially, it was part of the WebRTC specification, but later became a separate API accessible to all web applications.

### **The navigator.getUserMedia()**

In 2013, the `navigator.getUserMedia()` API emerged as the final standardized version. This API provides a powerful and flexible way to capture media devices, offering features like:

- Specifying the exact type of media to capture (webcam, microphone, screen)
- Defining constraints on the captured media (resolution, frame rate, etc.)
- Handling user permissions for accessing devices
- Receiving captured media data for processing or streaming

Since its inception, `navigator.getUserMedia()` has undergone several refinements and additions. For example, it now supports capturing multiple devices simultaneously, capturing specific regions of the screen, and handling promises for asynchronous permission handling.

**MediaDevices and Promises (2017):**

- The WebRTC API continued to evolve, moving towards a promise-based syntax.
- The **`navigator.mediaDevices.getUserMedia()`** method replaced the older callback-based approach

I hope this comprehensive overview provides a clear understanding of the history and evolution of the getUserMedia API, enough talking let’s write some code.

## Set Up Your HTML File

Start by creating a basic HTML file that will serve as the foundation for your WebRTC project. Include the necessary elements, such as a video element to display the captured stream.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebRTC getUserMedia Example</title>
</head>
<body>
    <video id="localStream" autoplay playsinline></video>
	<button id="init-call-btn" onclick="initMediaCapture()" >Start</button>
	<button id="close-call-btn" onclick="closeMediaCapture()" >Close</button>

    <script src="app.js"></script>
</body>
</html>

```

## Create the JavaScript File

Now, let's create the JavaScript file (`app.js`) where we'll implement the WebRTC functionality.

```bash
touch app.js
```

Let’s get video and button DOM elements using `querySelector` .

```jsx
// app.js
const localStreamElement = document.querySelector("video#localStream");
const captureMediaBtn = document.querySelector("button#init-call-btn");
const closeMediaBtn = document.querySelector("button#close-call-btn");
```

The `constraints` parameter is an object with two members: `video` and `audio`, describing the media types requested, learn more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#constraints).

```jsx
// app.js
const constraints = {
  audio: true,
  video: true,
};
```

## Access User Media

Use the `navigator.mediaDevices.getUserMedia` method to prompt the user for permission to access their camera and microphone. Specify the constraints for the media you want to capture, such as video and audio.

```jsx
// app.js
webCamStream = await navigator.mediaDevices.getUserMedia(constraints);
```

## Display Local Stream

Once you've successfully captured the user's media stream, assign it to the `srcObject` property of the video element to display the live stream.

```jsx
// app.js
// Assign the stream to the video element
localStreamElement.srcObject = stream;
```

## Close User Media

Invoking `stop()` signals to the user agent that the media track's origin, be it a local file, network stream, or hardware device like a camera or microphone, is no longer required.

```jsx
if (localStreamElement.srcObject) {
    localStreamElement.pause();
    localStreamElement.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
}
```

## Code snippets combined

```jsx
// app.js
const localStreamElement = document.querySelector("video#localStream");
const captureMediaBtn = document.querySelector("button#init-call-btn");
const closeMediaBtn = document.querySelector("button#close-call-btn");

const constraints = {
  audio: true,
  video: true,
};

closeMediaBtn.disabled = true;

async function initMediaCapture () {
  captureMediaBtn.disabled = true;
  closeMediaBtn.disabled = false;

  try {
    webCamStream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamElement.srcObject = webCamStream;
  } catch (e) {
    alert("permission denied!!", e);
  }
}

async function closeMediaCapture () {
  if (localStreamElement.srcObject) {
    localStreamElement.pause();
    localStreamElement.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
  }

  closeMediaBtn.disabled = true;
  captureMediaBtn.disabled = false;
}
```

> Full example on [github](https://github.com/M-Kouache/webrtc-tutorial-series/tree/main/getUserMedia)

## Resources where you can learn more :

- [https://blog.chromium.org/2012/07/introducing-getusermedia-and-javascript.html](https://blog.chromium.org/2012/07/introducing-getusermedia-and-javascript.html)
- [https://web.dev/articles/getusermedia-intro](https://web.dev/articles/getusermedia-intro)
- [https://webrtc.ventures/2020/03/getusermedia-webrtc-api/](https://webrtc.ventures/2020/03/getusermedia-webrtc-api/)
- [https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [https://webrtc.org/getting-started/media-devices](https://webrtc.org/getting-started/media-devices)
