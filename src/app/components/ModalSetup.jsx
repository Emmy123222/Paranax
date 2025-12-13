"use client"

import { useEffect } from 'react';
import Modal from 'react-modal';

const ModalSetup = () => {
  useEffect(() => {
    // Set the app element for react-modal
    if (typeof window !== 'undefined') {
      const rootElement = document.getElementById('root') || document.body;
      Modal.setAppElement(rootElement);
    }
  }, []);

  return null; // This component doesn't render anything
};

export default ModalSetup;