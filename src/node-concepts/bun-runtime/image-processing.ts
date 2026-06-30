export interface BunImageProcessingOptions {
	targetHeight?: number | undefined;
	targetWidth?: number | undefined;
}

export interface BunImageProcessingResult {
	operation: {
		filter: "lanczos3";
		fit: "inside";
		format: "webp";
		targetHeight: number;
		targetWidth: number;
	};
	output: Bun.Image.Metadata & {
		bytes: number;
		mimeType: string;
	};
	source: Bun.Image.Metadata & {
		bytes: number;
	};
}

const SAMPLE_SOURCE_HEIGHT = 180;
const SAMPLE_SOURCE_WIDTH = 320;
const DEFAULT_TARGET_HEIGHT = 90;
const DEFAULT_TARGET_WIDTH = 160;
const BMP_HEADER_BYTES = 54;
const MAX_PIXELS = SAMPLE_SOURCE_WIDTH * SAMPLE_SOURCE_HEIGHT;

function assertPositiveInteger(value: number, name: string): void {
	if (!Number.isInteger(value) || value <= 0) {
		throw new Error(`${name} must be a positive integer`);
	}
}

/**
 * Builds a deterministic BMP fixture so the Image API example remains
 * dependency-free while still processing real encoded image bytes.
 */
export function createSampleBmp(
	width = SAMPLE_SOURCE_WIDTH,
	height = SAMPLE_SOURCE_HEIGHT,
): Uint8Array {
	assertPositiveInteger(width, "width");
	assertPositiveInteger(height, "height");

	const rowStride = Math.ceil((width * 3) / 4) * 4;
	const pixelBytes = rowStride * height;
	const fileSize = BMP_HEADER_BYTES + pixelBytes;
	const bytes = new Uint8Array(fileSize);
	const view = new DataView(bytes.buffer);

	bytes[0] = 0x42;
	bytes[1] = 0x4d;
	view.setUint32(2, fileSize, true);
	view.setUint32(10, BMP_HEADER_BYTES, true);
	view.setUint32(14, 40, true);
	view.setInt32(18, width, true);
	view.setInt32(22, height, true);
	view.setUint16(26, 1, true);
	view.setUint16(28, 24, true);
	view.setUint32(34, pixelBytes, true);

	const safeWidth = Math.max(width - 1, 1);
	const safeHeight = Math.max(height - 1, 1);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const offset = BMP_HEADER_BYTES + (height - 1 - y) * rowStride + x * 3;
			const horizontal = Math.round((x / safeWidth) * 255);
			const vertical = Math.round((y / safeHeight) * 255);

			bytes[offset] = horizontal;
			bytes[offset + 1] = vertical;
			bytes[offset + 2] = Math.round((horizontal + vertical) / 2);
		}
	}

	return bytes;
}

/**
 * Uses Bun.Image to decode a real source image, resize it off the JavaScript
 * thread, and re-encode it as WebP.
 */
export async function processSampleImageWithBun(
	options: BunImageProcessingOptions = {},
): Promise<BunImageProcessingResult> {
	const targetWidth = options.targetWidth ?? DEFAULT_TARGET_WIDTH;
	const targetHeight = options.targetHeight ?? DEFAULT_TARGET_HEIGHT;

	assertPositiveInteger(targetWidth, "targetWidth");
	assertPositiveInteger(targetHeight, "targetHeight");

	const sourceBytes = createSampleBmp();
	const source = await new Bun.Image(sourceBytes, {
		maxPixels: MAX_PIXELS,
	}).metadata();

	const outputBlob = await new Bun.Image(sourceBytes, {
		maxPixels: MAX_PIXELS,
	})
		.resize(targetWidth, targetHeight, {
			filter: "lanczos3",
			fit: "inside",
		})
		.webp({ quality: 82 })
		.blob();

	const output = await new Bun.Image(outputBlob, {
		maxPixels: targetWidth * targetHeight,
	}).metadata();

	return {
		operation: {
			filter: "lanczos3",
			fit: "inside",
			format: "webp",
			targetHeight,
			targetWidth,
		},
		output: {
			...output,
			bytes: outputBlob.size,
			mimeType: outputBlob.type,
		},
		source: {
			...source,
			bytes: sourceBytes.byteLength,
		},
	};
}
