import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductImageUpload = ({ images, setImages, primaryImageIndex, setPrimaryImageIndex }) => {

    const onDrop = useCallback(acceptedFiles => {
        // In a real app, this would upload to S3/Cloudinary.
        // Here we create object URLs for preview.
        const newImages = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    }, [setImages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 5
    });

    const removeImage = (index, e) => {
        e.stopPropagation();
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        // Reset primary if removed
        if (primaryImageIndex === index) setPrimaryImageIndex(0);
        else if (primaryImageIndex > index) setPrimaryImageIndex(primaryImageIndex - 1);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Product Images</label>

            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-turmeric bg-brand-turmeric/5' : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <div className="p-4 bg-gray-50 rounded-full mb-3">
                        <Upload size={24} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5 images)</p>
                </div>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                <AnimatePresence>
                    {images.map((file, index) => (
                        <motion.div
                            key={file.preview || file}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 group ${primaryImageIndex === index ? 'border-brand-turmeric ring-2 ring-brand-turmeric/20' : 'border-transparent'
                                }`}
                            onClick={() => setPrimaryImageIndex(index)}
                        >
                            <img
                                src={file.preview || file}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onLoad={() => {
                                    // Revoke data uri after image is loaded to avoid memory leaks
                                    if (file.preview) URL.revokeObjectURL(file.preview)
                                }}
                            />

                            {/* Actions Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                                {primaryImageIndex === index ? (
                                    <span className="text-[10px] bg-brand-turmeric text-brand-mahogany font-bold px-2 py-0.5 rounded-full">Primary</span>
                                ) : (
                                    <span className="text-[10px] text-white font-medium">Set Primary</span>
                                )}
                                <button
                                    onClick={(e) => removeImage(index, e)}
                                    className="p-1 bg-white/20 hover:bg-red-500 text-white rounded transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProductImageUpload;
