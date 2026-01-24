import React from 'react';

// Cloudinary Image Component
// Uses pure string manipulation to avoid large SDK dependency for simple resizing

// Initialize Cloudinary instance
// Note: Usually cloudName should be in env but for frontend often exposed or passed from config
// Assuming standard 'demo' or user's cloud name. I'll use a placeholder or check config.
// Better to pass publicId and full URL fallback.

const CloudinaryImage = ({ publicId, url, alt, className, width = 400, height = 300 }) => {

    // If we have a publicId, we can generate an optimized URL
    // If not, we fall back to the raw URL (which might already be a cloudinary URL but valid)

    // For this implementation, I'll rely on the raw URL if publicId isn't handy, 
    // BUT the user asked to use transformations. 
    // To do that generally requires the public_id.
    // The backend saves { image: url, imagePublicId: id }.

    if (!publicId && !url) return <div className={`bg-gray-200 ${className}`} />;

    let finalSrc = url;

    // Transformation Logic (Simple String Manipulation for now if SDK overhead is too much or config missing)
    // Cloudinary URLs are like: https://res.cloudinary.com/<cloud>/image/upload/v<ver>/<public_id>.<ext>
    // We can inject transformations after 'upload/'

    if (url && url.includes('cloudinary.com') && !url.includes('w_')) {
        // Simple manual injection if SDK isn't fully set up with env
        // This is robust and doesn't require extra package config if URL structure is standard
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex !== -1) {
            const prefix = url.slice(0, uploadIndex + 8);
            const suffix = url.slice(uploadIndex + 8);
            // w_<width>,h_<height>,c_fill,q_auto,f_auto
            const transform = `w_${width},h_${height},c_fill,q_auto,f_auto`;
            finalSrc = `${prefix}${transform}/${suffix}`;
        }
    }

    return (
        <img
            src={finalSrc}
            alt={alt}
            className={className}
            loading="lazy"
        />
    );
};

export default CloudinaryImage;
