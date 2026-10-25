# Real-time systems lab

Run a local message stream and observe persistence, retries, disconnects, and
cursor replay in two browser tabs. It uses the reference implementations in
[the lab server](../src/course/realtime-lab.ts) and
[the SQLite event log](../src/node-concepts/system-design/durable-event-log.ts).

```bash
bun run course:lab
```

The command checks TypeScript before startup and before each watch restart.
WebSocket handler failures close only the affected connection. Failures during
the opening handshake may appear as abnormal close 1006; established
connections receive the internal-error close code 1011 when delivery succeeds.

Open [the local lab](http://127.0.0.1:3002/) twice and join the same room.
The command stores events in `data/realtime-lab.sqlite`. It needs no external
service or model credentials. Stop with Ctrl+C and restart the same command
to reuse the database. Tests use separate temporary or in-memory stores.

## Four experiments

| Experiment     | Action                                               | Expected evidence                                                            |
| -------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| Safe retry     | Publish once, then choose **Retry same event**       | Same sequence; commits stay unchanged; safe retries increase                 |
| Reconnect      | Disconnect one tab; publish in the other; reconnect  | Missing events return through HTTP catch-up or socket replay                 |
| Restart        | Stop the server, then restart with the same database | Committed history survives; process counters restart at zero                 |
| Bounded replay | While disconnected, publish more than 25 events      | HTTP pagination catches up; a socket with a large backlog is asked to resync |

The stream keeps at most 200 visible rows per tab. That is a presentation bound;
older committed records remain in SQLite. Browsers restored from their page
cache reconnect and restart metrics polling; an explicit manual disconnect
stays disconnected until you choose **Reconnect**.

## Guarantees to explain

1. **Commit before notification.** A successful new POST has a committed event
   before the server publishes it. A crash between commit and publication can
   lose the live hint; a later replay recovers the record.
2. **Retry identity.** The database enforces uniqueness for `(room, eventId)`.
   Repeating an ID and payload returns the original record. A different payload
   with the same ID returns HTTP 409. There is no second write.
3. **Cursor order.** Replay selects `sequence > after`, ordered by sequence,
   using an index. Sequences are global; gaps within one room are valid. They
   represent order, not elapsed time.
4. **Delivery and writes differ.** An idempotent write does not imply exactly-once
   delivery. Replayed notifications can overlap. The client suppresses records
   already covered by its cursor, and never advances that cursor from a POST
   response that could overtake earlier socket messages.

Subscribe and snapshot replay happen without an intervening `await` in one
JavaScript process. This closes the local subscribe/replay race. It does not
provide the same guarantee across replicas or concurrent external writers.

## Boundaries and follow-ups

The server binds to loopback and accepts the assigned port on `127.0.0.1` or
`localhost`. Browser origins must match the requested local origin. Rooms scope
events but are public to local clients; they do not implement authentication or
authorization. The global token bucket demonstrates write admission control;
it is not a tenant quota service.

Request bodies, replay pages, WebSocket payloads, socket backpressure, and the
rendered event list are bounded. Database retention is not bounded. A client
that falls behind reconnects using its cursor. Process counters are
observability examples, not durable business totals.

For a production design, explain authenticated subscriptions, tenant quotas,
retention and cursor expiry, shared publication between replicas, continuous
catch-up after lost notifications, durable storage failover, and load tests
for slow consumers. State which component owns each guarantee.

## Verification and sources

```bash
bun run course:test
bun test src/course
```

The integration tests need local HTTP and WebSocket access. They exercise real
SQLite persistence and actual sockets; the client lifecycle tests use a small
browser-event harness. These checks do not substitute for full browser testing.

- [Bun WebSockets](https://bun.com/docs/runtime/http/websockets): subscriptions,
  publication, and backpressure.
- [Bun SQLite](https://bun.com/docs/runtime/sqlite): transactions and database APIs.
- [SQLite isolation](https://www.sqlite.org/isolation.html): writer serialization
  and WAL snapshot behavior.
- [MDN pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event):
  page-cache restoration lifecycle.
