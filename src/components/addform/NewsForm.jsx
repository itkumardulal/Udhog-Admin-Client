import React, { useState } from 'react';
import * as filestack from 'filestack-js';

const client = filestack.init('YOUR_FILESTACK_API_KEY');

const NewsForm = () => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }

    if (file.size > 1024 * 1024) {
      alert('File must be less than 1MB');
      return;
    }

    setUploading(true);

    try {
      const response = await client.upload(file, {
        onProgress: (evt) => {
          // console.log('Uploading:', evt.totalPercent);
        }
      });

      setImageName(response.filename);
      setImageUrl(response.url);
      setUploading(false);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    previewFile(file);
    handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    previewFile(file);
    handleImageUpload(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">📰 Add News </h2>

      <form className="space-y-8">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter a catchy news title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 shadow-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            placeholder="Enter detailed description..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 shadow-sm resize-none"
            required
          ></textarea>
        </div>

        {/* Image Upload Field */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image <span className="text-gray-400">(Max 1MB)</span>
          </label>
          <div
            id="dropzone"
            className="w-full relative border-2 border-gray-300 border-dashed rounded-lg p-6 cursor-pointer transition hover:border-indigo-600 bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
              onChange={handleFileChange}
            />
            <div className="text-center">
              <img
                className="mx-auto h-12 w-12"
                src="https://www.svgrepo.com/show/357902/image-upload.svg"
                alt="Upload"
              />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                <span className="cursor-pointer">
                  Drag and drop
                  <span className="text-indigo-600"> or browse </span>
                  to upload
                </span>
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG up to 1MB
              </p>

              {uploading && <p className="text-blue-500 text-sm mt-2">Uploading...</p>}
              {!uploading && imageName && (
                <p className="text-green-600 text-sm mt-2">Uploaded: {imageName}</p>
              )}

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 mx-auto max-h-40 rounded shadow"
                />
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 
            transition-all shadow-md text-sm font-semibold"
          >
            Submit News
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
