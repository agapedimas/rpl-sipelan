const fs = require("fs/promises");
const path = require("path");
const { Jimp } = require("jimp");
const WebpConverter = require("webp-converter");

WebpConverter.grant_permission();

const tempRootPath = path.resolve(__dirname, "../../tmp");

/**
 * Resize and crop an image so the requested dimensions are fully covered.
 * @param {import("jimp").Jimp} image
 * @param {{width: number, height: number, horizontalAlignment?: "left" | "center" | "right", verticalAlignment?: "top" | "center" | "bottom"}} options
 */
function resizeImage(image, options) {
    const { width, height } = options;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
        throw new RangeError("Image width and height must be positive numbers.");

    const scale = Math.max(width / image.width, height / image.height);
    const resizedWidth = Math.round(image.width * scale);
    const resizedHeight = Math.round(image.height * scale);

    image.resize({ w: resizedWidth, h: resizedHeight });
    image.crop({
        x: getCropOffset(resizedWidth - width, options.horizontalAlignment),
        y: getCropOffset(resizedHeight - height, options.verticalAlignment),
        w: width,
        h: height
    });

    return image;
}

/**
 * Read, optionally resize/crop, and encode an image buffer as PNG.
 * The returned buffer is independent of the temporary files used to decode WebP.
 * @param {Buffer} buffer
 * @param {{width: number, height: number, horizontalAlignment?: "left" | "center" | "right", verticalAlignment?: "top" | "center" | "bottom"}=} resizeOptions
 * @returns {Promise<Buffer>}
 */
async function resizeBuffer(buffer, resizeOptions) {
    await fs.mkdir(tempRootPath, { recursive: true });
    const tempFolderPath = await fs.mkdtemp(path.join(tempRootPath, "image-"));

    try {
        let image = await readImage(buffer, tempFolderPath);
        if (resizeOptions)
            image = resizeImage(image, resizeOptions);

        return await image.getBuffer("image/png");
    }
    finally {
        await fs.rm(tempFolderPath, { recursive: true, force: true });
    }
}

/**
 * @param {number} overflow
 * @param {"left" | "center" | "right" | "top" | "bottom" | undefined} alignment
 */
function getCropOffset(overflow, alignment = "center") {
    if (alignment === "right" || alignment === "bottom")
        return overflow;
    if (alignment === "center")
        return Math.round(overflow / 2);
    return 0;
}

/**
 * Read an image buffer. WebP is decoded to PNG first because this project
 * uses webp-converter for WebP input support.
 * @param {Buffer} buffer
 * @param {string} tempFolderPath
 * @returns {Promise<import("jimp").Jimp>}
 */
async function readImage(buffer, tempFolderPath) {
    const { fileTypeFromBuffer } = await import("file-type");
    const fileType = await fileTypeFromBuffer(buffer);

    if (fileType?.mime !== "image/webp")
        return Jimp.read(buffer);

    const webpPath = path.join(tempFolderPath, "source.webp");
    const pngPath = path.join(tempFolderPath, "source.png");
    await fs.writeFile(webpPath, buffer);
    await WebpConverter.dwebp(webpPath, pngPath, "-o");
    return Jimp.read(pngPath);
}

/**
 * Save a buffer as a WEBP image, optionally resizing and cropping it.
 * @param {Buffer} buffer
 * @param {string} fileName
 * @param {string} folderPath
 * @param {{width: number, height: number, horizontalAlignment?: "left" | "center" | "right", verticalAlignment?: "top" | "center" | "bottom"}=} resizeOptions
 * @returns {Promise<void>}
 */
async function saveBufferToImageFile(buffer, fileName, folderPath, resizeOptions) {
    if (path.basename(fileName) !== fileName)
        throw new Error("fileName must not contain a directory path.");

    const outputFolderPath = path.resolve(folderPath);
    const outputFilePath = path.join(outputFolderPath, fileName);
    await fs.mkdir(outputFolderPath, { recursive: true });
    const resizedBuffer = await resizeBuffer(buffer, resizeOptions);
    const tempFolderPath = await fs.mkdtemp(path.join(tempRootPath, "image-"));
    const tempPngPath = path.join(tempFolderPath, "output.png");

    try {
        await fs.writeFile(tempPngPath, resizedBuffer);
        await WebpConverter.cwebp(tempPngPath, outputFilePath);
    }
    finally {
        await fs.rm(tempFolderPath, { recursive: true, force: true });
    }
}

module.exports = { resizeBuffer, saveBufferToImageFile };
