---
title: 'WebRTC and RTCPeerConnection: Establishing a peer-to-peer connection'
excerpt: "WebRTC (Web Real-Time Communication) has revolutionized the way we communicate on the web, enabling seamless real-time audio, video, and data sharing between browsers. At the core of WebRTC lies RTCPeerConnection."
coverImage: '/assets/blog/webrtc-part-three-rtcpeerconnection/cover.png'
date: '2024-01-31T05:35:07.322Z'
author:
  name: Mohamed Kouache
  picture: '/assets/blog/authors/mo.png'
ogImage:
  url: '/assets/blog/webrtc-part-three-rtcpeerconnection/cover.png'
---


WebRTC (Web Real-Time Communication) has revolutionized the way we communicate on the web, enabling seamless real-time audio, video, and data sharing between browsers. At the core of WebRTC lies RTCPeerConnection, a crucial component responsible for establishing and managing peer-to-peer connections. In this step-by-step guide, we'll explore the fundamentals of RTCPeerConnection and learn how to implement it for building robust real-time communication applications.

### Understanding RTCPeerConnection

RTCPeerConnection is the JavaScript API in WebRTC that enables direct communication between browsers. It handles the establishment, maintenance, and termination of peer-to-peer connections, facilitating the exchange of audio, video, and data streams.

### Setting Up a Basic HTML Structure

Start by creating a simple HTML file with the necessary elements for your real-time communication application. Include script tags to import the WebRTC API.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebRTC - RTCPeerConnection</title>
  </head>
  <body>
    <video id="localStream" class="w-full" autoplay playsinline></video>
    <video id="remoteStream" class="w-full" autoplay playsinline></video>

    <button id="start-btn">Start</button>
    <button id="call-btn">Call</button>
    <button id="hangup-btn">HangUp</button>

    <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

### Creating RTCPeerConnection Objects

In your JavaScript code, initialize RTCPeerConnection objects for both local and remote peers. Handle the creation and configuration of these objects.

```jsx
const startBtn = document.querySelector("button#start-btn");
const callBtn = document.querySelector("button#call-btn");
const hangupBtn = document.querySelector("button#hangup-btn");

// Declare variables for local and remote peer connections
let localPeerConnection;
let remotePeerConnection;

// for tracks containing the requested types of media
let localStream;

// an object specifying the types of media to request
const constraints = {
  audio: true,
  video: true,
};

hangupBtn.disabled = true;
callBtn.disabled = true;

// Function to create a local peer connection
function createLocalPeerConnection() {
  localPeerConnection = new RTCPeerConnection();
  // Add event listeners and configure the connection
  localPeerConnection.onicecandidate = (e) =>
    handleICECandidateEvent(localPeerConnection, e);
}

// Function to create a remote peer connection
function createRemotePeerConnection() {
  remotePeerConnection = new RTCPeerConnection();
  // Add event listeners and configure the connection
  remotePeerConnection.onicecandidate = (e) =>
    handleICECandidateEvent(remotePeerConnection, e);
  remotePeerConnection.ontrack = handleTrackEvent;
}
```

### Configuring Media Streams

Define functions to capture and add audio and video streams to the local RTCPeerConnection.

```jsx
// Function to prompts the user for permission to use a media input
async function addLocalStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById("localStream").srcObject = localStream;
    callBtn.disabled = false;
  } catch (e) {
    console.error("Error accessing media devices:", error);
  }
}

function addStreamToPeerConnection() {
  localStream
    .getTracks()
    .forEach((track) => localPeerConnection.addTrack(track, localStream));
}

```

### Signaling

While WebRTC lets devices connect directly, they still need a "matchmaker" to exchange info and set things up securely. That's where the signaling server comes in! In this tutorial, we'll focus on  exchanging info between peers localy, but stay tuned for a dedicated article diving deep into the world of signaling servers.

### Establishing the Connection

The process of negotiating and establishing the connection between local and remote peers involves several steps.

**1. Offer/Answer Negotiation**

- **Offer**
    - One peer initiates the connection by creating an `SDP offer` using `createOffer()`.
    - This offer describes the capabilities and media types the peer wants to exchange.
- **Answer**
    - The receiving peer creates an `SDP answer` using `createAnswer()` based on the offer.
    - The answer describes its capabilities and accepts or rejects media types.

**2. Setting Remote Descriptions**

- Each peer sets the received description (offer or answer) using `setRemoteDescription()`.
- This allows the peer to understand the other's capabilities and media streams.

**3. Adding Media Tracks**

- Each peer adds media tracks (audio/video) using `addTrack()` to send data.
- These tracks are associated with the `RTCPeerConnection`.

**4. Connection Management**

- The `oniceconnectionstatechange` event indicates connection status changes (connected, disconnected).
- Use `onicecandidate` events to exchange ICE candidates for NAT traversal.
- Handle errors and disconnections appropriately.

```jsx
// Function to initiate the connection
async function startConnection() {
  createLocalPeerConnection();
  createRemotePeerConnection();
  addStreamToPeerConnection();

  hangupBtn.disabled = false;

  // Create an offer and set it as the local description
  const offer = await localPeerConnection.createOffer();
  try {
    localPeerConnection.setLocalDescription(offer);
  } catch (e) {
    console.log("error while setting setLocalDescription", e);
  }

  // Setting the offer to the remote peer
  try {
    remotePeerConnection.setRemoteDescription(offer);
  } catch (e) {
    console.log("error while setting setRemoteDescription", e);
  }
  try {
    handleRemoteOffer(offer);
  } catch (e) {
    console.log("error while creatting answer", e);
  }
}

// Function to handle the remote offer and create an answer
async function handleRemoteOffer(offer) {
  remotePeerConnection.setRemoteDescription(offer);

  // Create an answer and set it as the local description
  const answer = await remotePeerConnection.createAnswer();
  remotePeerConnection.setLocalDescription(answer);

  // Setting the answer to the local peer (via signaling)
  localPeerConnection.setRemoteDescription(answer);
}

// Event listener for ICE candidate events on the local/remote peer connection
async function handleICECandidateEvent(peer, event) {
  try {
    console.log("other peer", getOtherPeerConnection(peer));
    await getOtherPeerConnection(peer).addIceCandidate(event.candidate);
  } catch (e) {
    console.log("error:", peer, e);
  }
}

function getOtherPeerConnection(peer) {
  return peer === localPeerConnection
    ? remotePeerConnection
    : localPeerConnection;
}
```

### Close Connections

```jsx
function hangup() {
  const videoElement = document.getElementById("localStream");
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  localStream = null;
  videoElement.pause();
  videoElement.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  hangupBtn.disabled = true;
  callBtn.disabled = true;
  startBtn.desabled = false;
}
```

> full functioning example on [github](https://github.com/M-Kouache/webrtc-tutorial-series/tree/main/RTCPeerConnection)

Remember, this guide provides a foundational understanding of RTCPeerConnection. Real-world applications require additional features and considerations,  Happy coding!



