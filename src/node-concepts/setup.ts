import { afterAll } from "bun:test";
import { stopServer } from "@/node-concepts/server";

const symbolConstructor = globalThis.Symbol as SymbolConstructor & {
	asyncDispose?: symbol;
	dispose?: symbol;
};

if (typeof symbolConstructor.dispose === "undefined") {
	Object.defineProperty(symbolConstructor, "dispose", {
		configurable: true,
		value: symbolConstructor("Symbol.dispose"),
	});
}

if (typeof symbolConstructor.asyncDispose === "undefined") {
	Object.defineProperty(symbolConstructor, "asyncDispose", {
		configurable: true,
		value: symbolConstructor("Symbol.asyncDispose"),
	});
}

afterAll(async () => {
	console.log("Shutting down shared server...");
	await stopServer(true);
});
