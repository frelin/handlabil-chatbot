import React, { useState, useEffect } from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, onClose }) => {

  const [wrong, setWrong] = useState(false);
  useEffect(() => {
    if(isOpen){
      setTimeout(() => {
        setWrong(true);
      }, 10000);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="flex flex-col items-center">
          <div className="loader"></div>
          <p className="mt-4 text-[#1d7048]">Laddar, vänta...</p>
          {wrong && (<button onClick={()=>window.location.reload()} className="bg-gray-800 text-white px-4 py-2 rounded mt-4 z-10">Uppdatera</button>)}
        </div>
    </div>
  );
};

export default LoadingModal;