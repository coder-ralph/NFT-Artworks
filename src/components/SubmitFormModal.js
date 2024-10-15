import React from 'react';
import SubmitForm from './SubmitForm';
import { AiOutlineClose } from 'react-icons/ai';

const SubmitFormModal = ({ closeModal, setUploadedFiles }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    <AiOutlineClose />
                </button>
                <SubmitForm setUploadedFiles={setUploadedFiles} closeModal={closeModal} />
            </div>
        </div>
    );
};

export default SubmitFormModal;
