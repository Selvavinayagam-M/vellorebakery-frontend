/**
 * Cloudinary Image Service
 * Handles uploading images to the "bakery_master" preset and generating optimized URLs.
 */

const CLOUD_NAME = "dfam8vo85"; // Configured from user input
const UPLOAD_PRESET = "bakery_master";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Uploads a file to Cloudinary using the unsigned preset ("bakery_master").
 * Auto-renames the file based on the product name for SEO.
 * 
 * @param {File} file - The file object from an input element.
 * @param {string} productName - The name of the product (e.g., "Mysore Pak").
 * @returns {Promise<string>} - The secure URL of the uploaded master image.
 */
export const uploadToCloudinary = async (file, productName) => {
    if (!file) throw new Error("No file provided");
    if (!productName) throw new Error("Product name is required for uploading");

    const formData = new FormData();

    // Convert product name -> SEO friendly filename (e.g. "Mysore Pak" -> "mysore-pak")
    const publicId = productName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("public_id", publicId);
    formData.append("folder", "bakery/master-images");
    // formData.append("use_filename", "true"); // Not allowed in unsigned uploads
    // formData.append("unique_filename", "false");

    try {
        const response = await fetch(UPLOAD_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        return {
            url: data.secure_url,
            publicId: data.public_id
        };
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

/**
 * Generates an optimized Cloudinary URL with specified dimensions and quality settings.
 * @param {string} masterUrl - The original Cloudinary URL.
 * @param {object} options - Options for optimization.
 * @param {number} options.width - Target width.
 * @param {number} options.height - Target height.
 * @param {string} [options.crop="fill"] - Crop mode (default: fill).
 * @param {boolean} [options.autoFormat=true] - specific f_auto (default: true).
 * @param {boolean} [options.autoQuality=true] - specific q_auto (default: true).
 * @returns {string} - The transformed URL.
 */
export const getOptimizedImageUrl = (masterUrl, { width, height, crop = "fill", autoFormat = true, autoQuality = true } = {}) => {
    if (!masterUrl || !masterUrl.includes("cloudinary.com")) return masterUrl;

    // Construct transformation string
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (autoQuality) transformations.push("q_auto");
    if (autoFormat) transformations.push("f_auto");

    const transformationString = transformations.join(",");

    // Insert transformation into URL
    // Pattern: .../upload/{transformations}/v... or .../upload/{transformations}/folder...
    // We look for "/upload/" and insert after it.
    const uploadIndex = masterUrl.indexOf("/upload/");
    if (uploadIndex === -1) return masterUrl;

    const prefix = masterUrl.substring(0, uploadIndex + 8); // include "/upload/"
    const suffix = masterUrl.substring(uploadIndex + 8);

    return `${prefix}${transformationString}/${suffix}`;
};

/**
 * Standard Sizes for the Bakery Website
 * Use these constants to ensure consistency.
 */
export const IMAGE_SIZES = {
    HERO_DESKTOP: { width: 1920, height: 1080 },
    HERO_MOBILE: { width: 800, height: 1000 },
    COLLECTION_LARGE: { width: 800, height: 800 },
    COLLECTION_MEDIUM: { width: 600, height: 450 },
    PRODUCT_CARD: { width: 600, height: 450 },
    THUMBNAIL: { width: 300, height: 225 },
};
