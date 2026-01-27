import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({ children, className, hoverEffect = true, ...props }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {}}
            className={clsx(
                'bg-white rounded-xl overflow-hidden shadow-md border border-gray-100',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;


