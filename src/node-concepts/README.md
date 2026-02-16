# PromiseTaskQueue Concepts

This module implements a **concurrency-limited, FIFO async task queue** for JavaScript/TypeScript. It’s designed to safely manage async tasks in environments like **Bun, Node.js, and browsers**.

---

## Key Concepts

### 1️⃣ Async Task Factory

- Each task is a function returning a `Promise`.
- Using a **factory function** ensures the task does **not start immediately**, but only when the queue schedules it.

**Type Definition:**

```ts
export type AsyncTask<T> = () => Promise<T>;
```

---

### 2️⃣ Concurrency-Limited Execution

- The queue allows only `maxConcurrency` tasks to run simultaneously.
- Tasks beyond the limit are queued and executed in **FIFO order**.
- Prevents overloading CPU or network resources.

**Example Concept:**

```ts
const queue = new PromiseTaskQueue(2);
queue.enqueue(task1);
queue.enqueue(task2);
queue.enqueue(task3); // queued until one finishes
```

---

### 3️⃣ Deterministic FIFO Behavior

- Tasks execute in the order they were enqueued.
- Ensures predictable results and execution order.
- Important for tasks where order matters, e.g., sequential API calls or dependent computations.

---

### 4️⃣ Idle Detection

- The queue can notify when it becomes **idle** (no active or pending tasks).
- Useful for batching operations or synchronizing with other parts of an app.

**Usage:**

```ts
await queue.waitForIdle(); // resolves with results & errors
```

- Returns a `QueueSummary`:

```ts
export interface QueueSummary<T> {
  results: T[]; // successfully completed task results
  errors: unknown[]; // captured errors from failed tasks
}
```

---

### 5️⃣ Error Isolation

- Failed tasks do **not stop the queue**.
- Errors are captured and returned in the summary.
- Ensures other tasks continue executing even if some fail.

---

### 6️⃣ Strong Typing

- Generic type `T` ensures that results have predictable types.
- Provides type safety for both results and error handling in TypeScript.

---

### 7️⃣ Automatic Task Scheduling

- The queue automatically starts tasks whenever a slot is available.
- No need for manual polling.
- Handles concurrency transparently.

**Internal Workflow:**

1. Task enqueued → added to `pendingTasks`.
2. `run()` checks for available slots.
3. Task executed → `activeCount` incremented.
4. Task finished → `activeCount` decremented, `run()` called again.
5. Queue idle → `idleResolvers` are resolved.

---

### 8️⃣ Practical Applications

- Managing **API requests** without exceeding rate limits.
- Running **CPU-heavy tasks** with controlled concurrency.
- Scheduling **background jobs** in web apps.
- Coordinating **batch operations** in Node.js or Bun.

---

### 9️⃣ Safety Considerations

- `maxConcurrency` must be ≥ 1.
- Tasks are wrapped in `.then/.catch/.finally` to ensure `activeCount` is always decremented.
- Idle detection is event-driven—no busy waiting.
- Keeps **main thread responsive** while handling multiple tasks asynchronously.

---

# Bun HTTP Server Concepts

This module demonstrates **high-performance HTTP server design** in Bun with safe handling of CPU-intensive tasks.

## Key Concepts

### 1️⃣ Fast Routes

- Routes like `/` respond immediately.
- Ideal for serving static or lightweight requests.
- Ensures minimal latency for end users.

**Example:**

```ts
if (path === "/") return "Fast response";
```

---

### 2️⃣ Blocking Routes

- Demonstrates synchronous blocking work (`while` loops) for illustration.
- Blocking routes pause the event loop, making other requests wait.
- **Not recommended in production** for heavy computations.

**Example:**

```ts
if (path === "/count") {
  const start = Date.now();
  while (Date.now() - start < 50) {} // busy wait
  return "Blocking done!";
}
```

---

### 3️⃣ Offloading CPU Work to Workers

- CPU-intensive tasks are offloaded to **Workers** to avoid blocking the main thread.
- Each worker is terminated after completing its task for safe resource management.
- Allows the server to remain responsive even under heavy computation.

**Example:**

```ts
if (path === "/worker") {
  const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  });

  worker.onmessage = (event) => {
    resolve(event.data);
    worker.terminate();
  };

  worker.onerror = (err) => {
    reject(err);
    worker.terminate();
  };

  worker.postMessage({ task: "compute" });
}
```

---

### 4️⃣ Safe Worker Lifecycle

- **Start:** `worker.postMessage()` triggers computation.
- **Completion:** `worker.onmessage` resolves the promise.
- **Error handling:** `worker.onerror` rejects the promise.
- **Cleanup:** `worker.terminate()` ensures no lingering CPU threads.

This pattern guarantees that:

- Heavy tasks do not block fast routes.
- Resources are properly released.
- The main event loop remains responsive.

---

### 5️⃣ Combining Fast and Heavy Routes

- Fast routes handle lightweight requests immediately.
- Workers handle CPU-heavy routes in parallel.
- Blocking routes illustrate what happens **without offloading**.
- Demonstrates the importance of non-blocking architecture in Node/Bun servers.

---

### 6️⃣ Practical Takeaways

- Use **Workers** for CPU-intensive tasks in Bun.
- Always terminate workers after use to prevent memory leaks.
- Avoid synchronous blocking in production routes.
- Keep the main thread light for high throughput.
- Design APIs to separate **fast responses** from **heavy computation**.

---

# Async Cancellable Operations

This module provides a **pattern for cancellable asynchronous operations** using async generator functions in JavaScript/TypeScript.

It allows you to run async operations that can be **safely cancelled**, while still producing a standard Promise result.

---

## Key Concepts

### 1️⃣ Cancellable Async Operation

- Wrap an async generator function to produce an operation that can be **cancelled at any time**.
- Returns an object containing:

```ts
{
  promise: Promise<ReturnType>; // resolves with final generator result
  cancel: () => void;           // immediately stops generator and rejects
}
```

---

### 2️⃣ Generator-Based Flow

- Async generators (`async function*`) allow sequential yields.
- Each `yield` can produce a value or a `Promise`.
- Generator resumes after `next(resolvedValue)`.

**Why generators?**

- They let you **pause/resume computation** at each step.
- Perfect for long-running or stepwise asynchronous tasks.

---

### 3️⃣ Cancellation Mechanism

- Call `cancel()` to **stop the generator immediately**.
- The promise returned will reject with an `"Operation Cancelled"` error.
- Internally calls `generatorIterator.return()` to terminate generator safely.

**Example:**

```ts
const cancellable = createAsyncCancellable<[], number, number>(
  async function* () {
    const a = yield 1;
    const b = yield a + 2;
    return b * 2;
  },
);

const { promise, cancel } = cancellable();

// Cancel after 100ms
setTimeout(cancel, 100);

promise
  .then((result) => console.log("Result:", result))
  .catch((err) => console.error(err.message)); // "Operation Cancelled" if cancelled
```

---

### 4️⃣ Promise Integration

- The utility wraps the generator execution in a **Promise**.
- Resolves with the final generator value if completed.
- Rejects if cancelled or if any generator step throws an error.

---

### 5️⃣ Safe Error Handling

- Errors thrown inside the generator are caught and propagated through the Promise.
- Cancelling triggers a controlled error (`"Operation Cancelled"`).
- Supports async values yielded by the generator (awaitable).

---

### 6️⃣ Practical Applications

- **Long-running operations** with checkpoints (e.g., file processing, data streaming).
- **Stepwise async workflows** that may need cancellation.
- **UI-related async tasks** where the user may abort actions (e.g., search, download, or computation).
- **Resource-sensitive operations** in Node.js or browser contexts.

---

# Promise Study Suite

A structured learning project that demonstrates and tests all major JavaScript Promise methods using real, testable examples.

This project is designed for:

- 📚 Deep understanding of Promises
- 🧪 Writing proper async tests
- 🎯 Interview preparation
- 🧠 Internalizing concurrency behavior

---

## 📦 What This Project Covers

The following Promise APIs are implemented and tested:

- `Promise.resolve`
- `Promise.reject`
- `Promise.all`
- `Promise.allSettled`
- `Promise.race`
- `Promise.any`
- `.then`
- `.catch`
- `.finally`

Each method:

- Is wrapped inside a testable utility function
- Has both success and failure test cases
- Includes edge-case handling

---

## 📘 Covered Examples

### 1️⃣ Promise.resolve

```ts
resolvedValue(42);
```

````

Returns a resolved promise.

---

### 2️⃣ Promise.reject

```ts
rejectedValue("error");
```

Returns a rejected promise.

---

### 3️⃣ Promise.all

- Resolves when ALL promises resolve
- Rejects immediately if one fails

---

### 4️⃣ Promise.allSettled

- Waits for ALL promises
- Never rejects
- Returns status objects

---

### 5️⃣ Promise.race

- Resolves or rejects with the first settled promise

---

### 6️⃣ Promise.any

- Resolves with first successful promise
- Rejects with `AggregateError` if all fail

---

### 7️⃣ then chaining

Demonstrates transformation through chaining:

```ts
Promise.resolve(5)
  .then((v) => v * 2)
  .then((v) => v + 5);
```

---

### 8️⃣ catch handling

Demonstrates recovery from rejection.

---

### 9️⃣ finally behavior

Demonstrates cleanup logic that runs regardless of outcome.

---

## 🧪 Example Test Case

```ts
test("resolves with provided value", async () => {
  await expect(resolvedValue(42)).resolves.toBe(42);
});
```

---

## ⚠️ Important Concepts Reinforced

- Promises are eager (executor runs immediately)
- Resolution happens in the microtask queue
- `.then()` always returns a new Promise
- Errors thrown inside `.then()` automatically reject
- `.finally()` does not receive resolved value
- `Promise.any()` throws `AggregateError`

---

## 🎯 Recommended Study Order

1. `Promise.resolve` & `Promise.reject`
2. `.then` chaining
3. `.catch`
4. `.finally`
5. `Promise.all`
6. `Promise.race`
7. `Promise.allSettled`
8. `Promise.any`

---

## 🧠 Advanced Extensions (Optional)

You can extend this project by:

- Adding fake timer tests
- Implementing a custom Promise
- Testing microtask ordering
- Adding concurrency limiters
- Simulating network delays
- Writing stress tests with 1000+ promises

---
````
