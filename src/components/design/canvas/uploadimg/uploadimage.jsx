// UploadImage.jsx
import React, { useRef, useEffect } from 'react';
import './uploadimg.css';

const UploadImage = ({ onImageAdd }) => {
  const fileInputRef = useRef();

  // عند لصق صورة من الحافظة
//  useEffect(() => {
//   const handlePaste = (e) => {
//     e.preventDefault(); // منع السلوك الافتراضي (فتح الصورة في تبويب جديد)

//     const items = e.clipboardData.items;
//     for (const item of items) {
//       if (item.type.indexOf('image') !== -1) {
//         const file = item.getAsFile();
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           onImageAdd(event.target.result); // عرض الصورة داخل الواجهة
//         };
//         reader.readAsDataURL(file);
//       }
//     }
//   };

//   window.addEventListener('paste', handlePaste);
//   return () => window.removeEventListener('paste', handlePaste);
// }, [onImageAdd]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageAdd(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <button className='upload-btn' onClick={() => fileInputRef.current.click()}>
        upload img
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UploadImage;
