import React, { useState } from 'react';
import * as filestack from 'filestack-js';

const client = filestack.init('YOUR_FILESTACK_API_KEY'); // Replace with your actual API key

const NoticeForm = () => {
  const [uploading, setUploading] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handlePdfUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('PDF must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const response = await client.upload(file);
      setPdfName(response.filename);
      setPdfUrl(response.url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handlePdfUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handlePdfUpload(file);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">📢 Add Notice</h2>
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
            placeholder="Enter a notice title"
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
            placeholder="Enter notice details..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 shadow-sm resize-none"
            required
          ></textarea>
        </div>

        {/* PDF Upload Styled Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF <span className="text-gray-400">(Max 10MB)</span></label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-indigo-500 transition cursor-pointer"
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 z-50 cursor-pointer"
            />
            <div className="text-center">
              {/* New SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
              </svg>

              <p className="text-sm text-gray-700 font-medium mt-2">
                Drag and drop
                <span className="text-indigo-600"> or browse </span>
                to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">Only PDF files under 10MB</p>

              {uploading && (
                <p className="mt-2 text-blue-500 text-sm">Uploading PDF...</p>
              )}
              {!uploading && pdfName && (
                <p className="mt-2 text-green-600 text-sm truncate">Uploaded: {pdfName}</p>
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
            Submit Notice
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;
