import React, { useState } from 'react';
import * as filestack from 'filestack-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiAuthenticated } from '../../http';
import { useNavigate } from 'react-router-dom';

const client = filestack.init(import.meta.env.VITE_FILESTACK_API_KEY);

const NewsForm = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setPreview(reader.result);
  };

  const uploadImage = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('Image must be less than 1MB');
      return;
    }

    setUploading(true);
    try {
      const result = await client.upload(file, {
        onProgress: (evt) => {
       
        },
      });

      setImageName(result.filename);
      setImageUrl(result.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    previewFile(file);
    uploadImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    previewFile(file);
    uploadImage(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
  
      const payload = {
        ...formData,
        ...(imageUrl && { imgUrl: imageUrl }),
        ...(imageName && { imgName: imageName }),
      };

      const response = await apiAuthenticated.post('/news', payload);

      if (response.status === 201) {
        toast.success('News submitted successfully!');
          setTimeout(() => {
        navigate('/view/news');
      }, 5000);
      } else {
        toast.error('Failed to submit news');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📰 Add News</h2>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a catchy news title"
            className="bg-gray-50 border border-gray-300 rounded-lg p-3 w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Enter detailed description..."
            className="bg-gray-50 border border-gray-300 rounded-lg p-3 w-full resize-none"
            required
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image{' '}
            <span className="text-gray-400">(Optional, max 1MB)</span>
          </label>
          <div
            className="w-full relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              className="absolute inset-0 w-full h-full opacity-0 z-50"
              onChange={handleFileChange}
            />
            <div className="text-center">
              <img
                className="mx-auto h-12 w-12"
                src="https://www.svgrepo.com/show/357902/image-upload.svg"
                alt="Upload"
              />
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop or browse
              </p>
              {uploading && (
                <p className="text-blue-500 mt-2">Uploading...</p>
              )}
              {!uploading && imageName && (
                <p className="text-green-600 mt-2">Uploaded: {imageName}</p>
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

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md text-sm font-semibold hover:cursor-pointer"
          >
            {submitting ? 'Submitting...' : 'Submit News'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
