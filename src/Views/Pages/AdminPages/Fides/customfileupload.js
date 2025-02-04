import React, { useState, useRef, useEffect } from 'react';

const CustomFileUpload = ({
  value = [],
  setFieldValue,
//   maxFiles = 5
}) => {
  const fileInputRef = useRef(null);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Handle already processed files (base64, URLs)
      if (typeof file === 'string' &&
          (file.startsWith('data:image') || file.startsWith('https://'))) {
        resolve(file);
        return;
      }

      if (file instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      } else {
        resolve(file);
      }
    });
  };

  const handleFileSelect = async (e) => {
    const newFiles = Array.from(e.target.files);

    try {
      const base64Files = await Promise.all(
        newFiles.map((file) => toBase64(file))
      );

      // Function to check if file already exists
      const isUnique = (file, index, self) => {
        return self.findIndex(t =>
          // Compare by base64 content or URL
          t === file ||
          // For files that might have been converted to base64 previously
          (typeof t === 'string' && typeof file === 'string' &&
           (t.includes(file) || file.includes(t)))
        ) === index;
      };

      // Filter unique files
      const uniqueFiles = base64Files.filter(isUnique);

      // Combine with existing files, respecting max file limit
      //const combinedFiles = [...value, ...uniqueFiles].slice(0, maxFiles);
      const combinedFiles = [...value, ...uniqueFiles].slice(0);

      // Remove duplicates from combined files
      const finalFiles = combinedFiles.filter(isUnique);

      setFieldValue('images', finalFiles);

      // Optional: Show warning if files were limited or duplicates removed
    //   if (finalFiles.length < combinedFiles.length) {
    //     alert(`Maximum ${maxFiles} unique files allowed. Duplicates or excess files were removed.`);
    //   }
      if (finalFiles.length < combinedFiles.length) {
        alert('Duplicates or excess files were removed.');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = value.filter((_, i) => i !== indexToRemove);
    setFieldValue('images', updatedImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;

    const syntheticEvent = {
      target: { files }
    };

    handleFileSelect(syntheticEvent);
  };

  return (
    <div>
      <div
        className="file-upload-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed #cccccc',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />
        <p className="m-0">Drag and drop images here or click to browse</p>
      </div>

      {/* Image Preview Section */}
      <div className="flex flex-wrap align-items-center gap-2 w-full mt-3">
        {value && value.length > 0 ? (
          value.map((image, index) => {
            // Unique key generation to prevent duplicate rendering
            const uniqueKey = typeof image === 'string'
              ? (image.startsWith('http') ? image : `base64-${index}`)
              : `file-${index}`;

            return (
              <div
                key={uniqueKey}
                className="relative"
                style={{
                  width: '100px',
                  height: '100px',
                  marginRight: '10px',
                  marginTop: '10px'
                }}
              >
                {typeof image === 'string' && !image.startsWith('data:') ? (
                  <img
                    alt={`Uploaded Image ${index + 1}`}
                    src={image.startsWith('https://')
                      ? image
                      : `https://property-management-tt.s3.ap-south-1.amazonaws.com/upload/feed/${image}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <img
                    alt={`Uploaded Image ${index + 1}`}
                    src={image.startsWith('data:') ? image : URL.createObjectURL(image)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div
                  className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                  style={{
                    right: '-11px',
                    top: '-5px',
                    backgroundColor: '#f63939'
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                </div>
              </div>
            );
          })
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>

      {/* Display number of images */}
      {value && value.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {value.length} image{value.length !== 1 ? 's' : ''} uploaded
        </div>
      )}
    </div>
  );
};

export default CustomFileUpload;
