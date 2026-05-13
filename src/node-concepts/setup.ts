import { afterAll } from "bun:test";
import { stopServer } from "@/node-concepts/server";

afterAll(async () => {
	console.log("Shutting down shared server...");
	await stopServer(true);
});
