import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { hideToast } from '../../store/uiSlice';

const Toast = () => {
    const dispatch = useDispatch();
    const { isOpen, message, type } = useSelector((state) => state.ui.toast);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                dispatch(hideToast());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, dispatch]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} className="text-green-500" />;
            case 'error': return <AlertCircle size={20} className="text-red-500" />;
            default: return <Info size={20} className="text-blue-500" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-l-4 border-green-500';
            case 'error': return 'border-l-4 border-red-500';
            default: return 'border-l-4 border-blue-500';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 20, x: '-50%' }}
                    className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md ${getBorderColor()}`}
                >
                    {getIcon()}
                    <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
                    <button onClick={() => dispatch(hideToast())} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
