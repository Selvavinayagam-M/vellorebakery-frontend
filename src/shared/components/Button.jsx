import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Button = ({
    children,
    variant = 'primary', // primary, secondary, outline, ghost
    size = 'md', // sm, md, lg
    className,
    isLoading,
    disabled,
    onClick,
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-brand-maroon text-white hover:bg-brand-maroon/90 shadow-lg hover:shadow-xl focus:ring-brand-maroon',
        secondary: 'bg-brand-gold text-brand-black hover:bg-brand-gold/90 shadow-md hover:shadow-lg focus:ring-brand-gold',
        outline: 'border-2 border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white',
        ghost: 'text-brand-maroon hover:bg-brand-maroon/10',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            type={type}
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
