import React from 'react';



const CloudinaryImage = ({ publicId, url, alt, className, width = 400, height = 300 }) => {

    

    if (!publicId && !url) return <div className={`bg-gray-200 ${className}`} />;

    let finalSrc = url;

    

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


