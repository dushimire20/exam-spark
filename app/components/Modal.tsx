import React from 'react';

type ConfirmButtonType = 'default' | 'danger' | 'success';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm?: () => void; // Optional: for confirmation dialogs
    confirmText?: string;
    cancelText?: string;
    confirmButtonType?: ConfirmButtonType;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonType = 'default',
}) => {
    if (!isOpen) return null;

    let confirmButtonClasses = "px-4 py-2 text-white text-base font-medium rounded-md w-auto shadow-sm focus:outline-none focus:ring-2";
    switch (confirmButtonType) {
        case 'danger':
            confirmButtonClasses += " bg-red-500 hover:bg-red-700 focus:ring-red-300";
            break;
        case 'success':
            confirmButtonClasses += " bg-green-500 hover:bg-green-700 focus:ring-green-300";
            break;
        default: // 'default' or any other value
            confirmButtonClasses += " bg-blue-500 hover:bg-blue-700 focus:ring-blue-300";
            break;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="p-5 w-96 shadow-lg rounded-md bg-white">
                <div className="text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                    <div className="items-center px-4 py-3 space-x-4">
                        {onConfirm && (
                            <button
                                id="confirm-button"
                                className={confirmButtonClasses}
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                {confirmText}
                            </button>
                        )}
                        <button
                            id="cancel-button"
                            className={`px-4 py-2 ${onConfirm ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'} text-base font-medium rounded-md w-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300`}
                            onClick={onClose}
                        >
                            {onConfirm ? cancelText : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
