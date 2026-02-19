import { afterAll } from "bun:test";
import { server } from "@/node-concepts/server";

afterAll(async () => {
	console.log("Shutting down shared server...");
	await server.stop(true);
});
