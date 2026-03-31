
import ImageKit from "@imagekit/next";

// Store these in environment variables in production
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const authenticatorEndpoint = "/api/imagekit-auth";

const imagekit = new ImageKit({
	publicKey,
	urlEndpoint,
	authenticationEndpoint: authenticatorEndpoint,
});

/**
 * Upload a file to ImageKit
 * @param {Object} params
 * @param {File|Blob} params.file
 * @param {string} params.fileName
 * @param {string} params.folder
 * @param {AbortSignal} [params.abortSignal]
 * @param {function} [params.onProgress]
 * @returns {Promise<any>}
 */
export async function upload({ file, fileName, folder, abortSignal, onProgress }) {
	return new Promise((resolve, reject) => {
		imagekit.upload(
			{
				file,
				fileName,
				folder,
				tags: ["clip-board-upload"],
				useUniqueFileName: true,
				responseFields: ["isPrivateFile", "url", "thumbnailUrl", "fileId"],
				abortSignal,
				progress: onProgress,
			},
			(err, result) => {
				if (err) return reject(err);
				resolve(result);
			}
		);
	});
}
