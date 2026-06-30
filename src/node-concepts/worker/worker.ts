/**
 * @file worker.ts
 * @description Worker that performs Bun-native image processing off the main thread.
 * Safe for your system and terminates after work.
 */

import {
	type BunImageProcessingResult,
	processSampleImageWithBun,
} from "../bun-runtime/image-processing";

declare var self: Worker;

type WorkerRequest = {
	targetHeight?: number;
	targetWidth?: number;
	task: "image-thumbnail";
};

type WorkerResponse =
	| {
			ok: true;
			result: BunImageProcessingResult;
	  }
	| {
			error: string;
			ok: false;
	  };

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
	try {
		if (event.data.task !== "image-thumbnail") {
			throw new Error(`Unsupported worker task: ${event.data.task}`);
		}

		const result = await processSampleImageWithBun({
			targetHeight: event.data.targetHeight,
			targetWidth: event.data.targetWidth,
		});

		self.postMessage({
			ok: true,
			result,
		} satisfies WorkerResponse);
	} catch (error) {
		self.postMessage({
			error: error instanceof Error ? error.message : String(error),
			ok: false,
		} satisfies WorkerResponse);
	}
};
