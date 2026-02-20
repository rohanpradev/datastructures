# JavaScript/TypeScript Async Utilities & Bun Modules – Learning Guide

This repository is designed to teach **modern async patterns** in JavaScript/TypeScript while providing **practical, production-ready examples** for Bun, Node.js, and browser environments.

It covers:

- **PromiseTaskQueue** – safely manage concurrent tasks
- **Bun HTTP Server** – non-blocking architecture and CPU-heavy task handling
- **CircuitBreaker** – resilient API calls and error isolation
- **Async Cancellable Operations** – cancelable, stepwise async workflows
- **Bun WebSocket Pub/Sub** – real-time, topic-based messaging

This guide explains **not just the code**, but _why_ and _how_ it works.

---

## 1️⃣ PromiseTaskQueue – Learning Concurrency Control

A **FIFO async task queue with concurrency limits**. This ensures your app handles multiple tasks safely without overwhelming CPU or network resources.

### Why it matters

In JavaScript, Promises are **eager**—they start immediately when created. For heavy tasks or rate-limited APIs, you need:

- Controlled concurrency
- FIFO execution order
- Isolation of errors

This queue does all three.

### How it works

1. **Task Factory:** Each task is a function returning a Promise, so it doesn’t start until scheduled.

```ts
export type AsyncTask<T> = () => Promise<T>;
```

2. **Concurrency Management:** The queue only runs `maxConcurrency` tasks at a time; others wait.

```ts
const queue = new PromiseTaskQueue(2);
queue.enqueue(task1);
queue.enqueue(task2);
queue.enqueue(task3); // waits until one finishes
```

3. **FIFO Execution:** Tasks complete in order, making dependent workflows predictable.

4. **Idle Detection:** Wait for all tasks to finish.

```ts
await queue.waitForIdle(); // returns results + errors
```

5. **Error Handling:** Failed tasks do not break the queue; errors are collected for reporting.

```ts
export interface QueueSummary<T> {
  results: T[];
  errors: unknown[];
}
```

**Practical Uses:**

- Throttling API requests
- Sequential data processing
- CPU-heavy background tasks

> 💡 Tip: Use `waitForIdle()` to synchronize when all tasks are complete, for example before shutting down a server or reporting results.

---

## 2️⃣ Bun HTTP Server – High-Performance, Non-Blocking Routes

This module demonstrates **fast and safe server design** in Bun.

### Key Concepts

1. **Fast Routes:** Respond immediately for lightweight requests.

```ts
if (path === "/") return "Fast response";
```

2. **Blocking Routes:** Demonstrates synchronous, CPU-heavy operations.
   ⚠️ Not recommended in production; blocks other requests.

```ts
const start = Date.now();
while (Date.now() - start < 50) {}
return "Blocking done!";
```

3. **Worker Offloading:** Heavy computations are delegated to **Workers**.

```ts
const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});
worker.onmessage = (e) => resolve(e.data);
worker.postMessage({ task: "compute" });
```

4. **Worker Lifecycle:** Safe startup, error handling, and termination prevent leaks and main thread blocking.

5. **Combining Fast & Heavy Routes:** Fast routes handle lightweight traffic; workers handle CPU-intensive tasks in parallel.

**Key Takeaways:**

- Always offload heavy computations
- Never block the main event loop in production
- Keep route responsibilities clear

> 💡 Teaching Note: This pattern separates “fast I/O” from “slow CPU-bound” operations—critical in high-performance web apps.

---

## 3️⃣ CircuitBreaker – Resilient API Calls

A **robust pattern for handling external or internal service failures**.

### Why it matters

APIs fail. If too many requests hit a failing service, you can trigger **cascading failures**. The circuit breaker prevents that.

### Core Features

- **States:** CLOSED, OPEN, HALF-OPEN
- **Failure Threshold:** Trips when error rate exceeds a set percentage
- **Rolling Window:** Counts requests only in recent history
- **Timeouts:** Slow requests are treated as failures
- **Reset Timeout & HALF-OPEN:** Test if service has recovered
- **Fallback Function:** Provides a default response when the service is down

```ts
const breaker = new CircuitBreaker(callApi, {
  failureThreshold: 50,
  minimumRequests: 5,
});
const result = await breaker.fire(); // either normal result or fallback
breaker.getState(); // "CLOSED" | "OPEN" | "HALF-OPEN"
```

**Practical Uses:**

- Protect external APIs from overload
- Maintain reliability in microservices
- Prevent one failing service from collapsing others

> 💡 Teaching Note: Circuit breakers are fundamental in **resilient distributed systems**. Always combine with logging and metrics.

---

## 4️⃣ Async Cancellable Operations

Allows **long-running async operations** to be safely cancelled.

### Why it matters

Sometimes the user wants to **abort a task**, e.g., a file download or data processing.

### How it works

- Wrap an **async generator** in a cancellable wrapper.
- Returns:

```ts
{
  promise: Promise<ReturnType>; // resolves when done
  cancel: () => void;           // stops the generator
}
```

- `cancel()` calls `generator.return()`, rejecting the promise with `"Operation Cancelled"`.

**Example:**

```ts
const { promise, cancel } = createAsyncCancellable(async function* () {
  const a = yield 1;
  const b = yield a + 2;
  return b * 2;
})();
setTimeout(cancel, 100); // cancel after 100ms
```

**Applications:**

- Stepwise async workflows
- Long-running batch operations
- UI-driven tasks where the user can abort

> 💡 Teaching Note: Async generators give you **pausable, resumable workflows**, which combined with cancellation improves responsiveness in complex apps.

---

## 5️⃣ Bun WebSocket Pub/Sub – Real-Time Messaging

Implements a **topic-based Pub/Sub system** using Bun’s WebSocket API.

### Core Features

- **Channel-Based Messaging:** Clients join channels; messages broadcast to subscribers.
- **System Messages:** Notify all clients when someone joins or leaves.
- **Sender Exclusion:** Clients do not receive their own messages.
- **Metrics:** Track active WebSockets and requests via `/metrics`.
- **Compression & Backpressure:** Handles large traffic efficiently.

```ts
ws.subscribe("room1");
server.publish("room1", "Hello!");
```

**Applications:**

- Chat apps
- Collaborative tools
- Multiplayer game lobbies
- Live dashboards

> 💡 Teaching Note: Focus on **non-blocking, low-latency design**. Bun’s WebSocket implementation is extremely fast—this pattern is production-ready for thousands of concurrent clients.

---

## ⚡ Summary – Learning Objectives

By studying this repository, you will learn:

1. How to **control concurrency** safely with a FIFO queue.
2. How to design **non-blocking Bun servers** for both fast I/O and CPU-heavy tasks.
3. How to implement **resilient APIs** with circuit breakers.
4. How to create **cancellable async workflows** using generators.
5. How to build **real-time Pub/Sub systems** with metrics and safe broadcasting.

Each module includes **examples, tests, and practical applications** to reinforce learning.

---

# Node.js Pub/Sub Example

This repository demonstrates a simple **Pub/Sub (Publisher/Subscriber) pattern** implemented purely in **Node.js** using the built-in `EventEmitter`.

No external dependencies are required. This is perfect for **interview demos** or understanding how Pub/Sub works internally.

---

## What is Pub/Sub?

Pub/Sub is a messaging pattern where:

- **Publishers** send messages to a **channel**.
- **Subscribers** listen to messages from a channel.
- Publishers and subscribers are **decoupled**, meaning publishers don’t need to know who is receiving the messages.

Think of it like a **newsletter system**: the publisher writes news, subscribers receive it if they are signed up.

---

## Implementation

We use **Node.js `EventEmitter`** to manage channels and listeners.

```js
const EventEmitter = require("events");

class PubSub {
  constructor() {
    this.emitter = new EventEmitter();
  }

  // Subscribe to a channel
  subscribe(channel, listener) {
    this.emitter.on(channel, listener);
  }

  // Unsubscribe from a channel
  unsubscribe(channel, listener) {
    this.emitter.off(channel, listener);
  }

  // Publish a message to a channel
  publish(channel, message) {
    this.emitter.emit(channel, message);
  }
}
```

---

## Usage Example

Here’s a complete example with multiple channels and subscribers:

```js
// Import PubSub
const pubsub = new PubSub();

// Subscriber 1 subscribes to "news"
pubsub.subscribe("news", (msg) => {
  console.log("Subscriber 1 received news:", msg);
});

// Subscriber 2 subscribes to "news"
pubsub.subscribe("news", (msg) => {
  console.log("Subscriber 2 received news:", msg);
});

// Subscriber 3 subscribes to "chat"
pubsub.subscribe("chat", (msg) => {
  console.log("Subscriber 3 received chat:", msg);
});

// Publish messages
pubsub.publish("news", "Breaking news: Node.js is awesome!");
pubsub.publish("chat", "Hello everyone in chat!");

// Unsubscribe Subscriber 2 from "news"
const subscriber2 = (msg) => console.log("Subscriber 2 received news:", msg);
pubsub.unsubscribe("news", subscriber2);

// Publish another news message
pubsub.publish("news", "More news after unsubscribe");
```

---

## Output

```
Subscriber 1 received news: Breaking news: Node.js is awesome!
Subscriber 2 received news: Breaking news: Node.js is awesome!
Subscriber 3 received chat: Hello everyone in chat!
Subscriber 1 received news: More news after unsubscribe
```

---

## Features

- Supports **multiple channels** (`news`, `chat`, etc.).
- Supports **multiple subscribers** per channel.
- Ability to **unsubscribe a specific listener**.
- Clean, **object-oriented design** using `EventEmitter`.
- Lightweight, **pure Node.js implementation**.

---

## Interview Tips

When discussing this in an interview:

1. Explain the **decoupling** of publishers and subscribers.
2. Highlight that this is **in-memory** and works for a single Node.js process.
3. Mention that for distributed systems, you would need a **real message broker** like **Redis Pub/Sub**, **RabbitMQ**, or **Kafka**.
4. Show understanding of **unsubscribe mechanics**, which prevents memory leaks.

---
