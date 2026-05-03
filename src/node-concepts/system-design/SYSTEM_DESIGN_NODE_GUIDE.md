# Node System Design Building Blocks

This folder contains small executable versions of common system design components. The goal is not to replace Redis, Envoy, NGINX, Kafka, or a database. The goal is to understand the core algorithm well enough to explain it in an interview.

## How To Discuss A System Design Component

Use this order:

1. Requirements: what should it do?
2. Scale: how many users, requests, keys, or events?
3. Data model: what needs to be stored?
4. Algorithm: how does it decide?
5. Failure modes: what can go wrong?
6. Production upgrade: what changes when it becomes distributed?

## Token Bucket Rate Limiter

File: `rate-limiter.ts`  
Class: `TokenBucketRateLimiter`

Use case:

- API gateway request throttling
- User/IP request limits
- Allowing short bursts while enforcing an average rate

Beginner explanation:

Imagine a bucket that holds tokens. Every request must spend one token. Tokens refill over time. If the bucket is empty, the request is rejected.

Step-by-step:

1. Start with a full bucket.
2. Before each request, calculate how many tokens should have refilled.
3. Cap tokens at bucket capacity.
4. If enough tokens exist, allow the request and subtract tokens.
5. Otherwise reject and return how long the caller should wait.

Production notes:

- In one Node process, an in-memory limiter works only for that process.
- In a distributed system, use Redis or another shared store.
- Use atomic operations or Lua scripts to prevent race conditions.

## Sliding Window Rate Limiter

File: `rate-limiter.ts`  
Class: `SlidingWindowRateLimiter`

Use case:

- Hard limit of `N` requests per rolling time window
- Fairer than a fixed window at boundaries

Beginner explanation:

Keep timestamps for recent requests. A request is allowed only if fewer than `limit` timestamps exist inside the current rolling window.

Step-by-step:

1. Remove timestamps older than `now - windowMs`.
2. If the remaining count is already at the limit, reject.
3. Otherwise append the current timestamp and allow.

Production notes:

- In memory, timestamp arrays can grow if keys are never cleaned.
- At scale, use Redis sorted sets or approximate counters.
- Sliding window is fair but can be more expensive than token bucket.

## LRU Cache

File: `lru-cache.ts`  
Class: `LRUCache`

Use case:

- URL shortener hot redirects
- API response caching
- User/session/config cache
- Feed or profile cache

Beginner explanation:

LRU means least recently used. When cache capacity is full, remove the item that has not been used for the longest time.

Data structures:

- `Map` gives O(1) lookup by key.
- Doubly linked list gives O(1) move-to-front and remove-tail.

Step-by-step:

1. On `get(key)`, return the value and move the entry to the front.
2. On `set(key, value)`:
   - update existing entry and move it to the front, or
   - insert a new entry at the front.
3. If capacity is exceeded, evict the tail.

Production notes:

- Add TTL when freshness matters.
- Use Redis/Memcached for shared cache across processes.
- Track hit rate, miss rate, evictions, and memory usage.

## Base62 Encoding

File: `id-generation.ts`  
Functions: `encodeBase62`, `decodeBase62`

Use case:

- URL shortener codes
- Compact public IDs
- Turning numeric database IDs into shorter strings

Beginner explanation:

Base62 uses digits, lowercase letters, and uppercase letters. That gives 62 possible characters for each position, which makes IDs shorter than decimal.

Step-by-step:

1. Divide the number by 62.
2. Use the remainder to pick one Base62 character.
3. Repeat with the quotient.
4. Reverse the collected characters.

Production notes:

- Sequential IDs are easy to encode but predictable.
- Add authorization and abuse controls if IDs expose resources.
- Use collision checks if IDs are generated randomly instead of from counters.

## Snowflake-Style IDs

File: `id-generation.ts`  
Class: `SnowflakeIdGenerator`

Use case:

- Distributed unique IDs without a central database counter
- Sortable IDs for logs, events, messages, and records

Beginner explanation:

A Snowflake-style ID packs multiple fields into one integer:

- timestamp
- worker ID
- sequence number inside the same millisecond

Step-by-step:

1. Read the current timestamp.
2. Subtract a custom epoch to keep the number smaller.
3. Add the worker ID so different machines do not collide.
4. Add a sequence counter for multiple IDs in the same millisecond.
5. Shift fields into fixed bit positions and combine them.

Production notes:

- Worker IDs must be unique across instances.
- Clock rollback must be handled.
- Sequence overflow can happen under extreme same-millisecond load.
