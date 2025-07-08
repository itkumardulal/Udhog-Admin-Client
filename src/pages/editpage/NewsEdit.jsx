import React, { useEffect, useState } from 'react';
import * as filestack from 'filestack-js';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiAuthenticated } from '../../http';
import 'react-toastify/dist/ReactToastify.css';

const client = filestack.init(import.meta.env.VITE_FILESTACK_API_KEY);

const NewsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchNewsData = async () => {
    try {
      const response = await apiAuthenticated.get(`/news/${id}`);
      if (response.status === 200) {
        const news = response.data.data;
        setFormData({ title: news.title, description: news.description });
        setImageName(news.imageName || '');
        setImageUrl(news.imageUrl || '');
        if (news.imageUrl) {
          setImageUrl(news.imageUrl);
          setPreview(news.imageUrl); 
        }
      } else {
        toast.error('Failed to fetch news data');
      }
    } catch (err) {
      toast.error('Error fetching news data');
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('File must be less than 1MB');
      return;
    }

    setUploading(true);

    try {
      const response = await client.upload(file);
      setImageName(response.filename);
      setImageUrl(response.url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload image');
    } finally {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      imageUrl,
      imageName
    };

    try {
      const response = await apiAuthenticated.patch(`/news/${id}`, payload);
      if (response.status === 200) {
        toast.success('News updated successfully!');
        navigate('/view/news'); 
      } else {
        toast.error('Failed to update news');
      }
    } catch (err) {
      toast.error('Error updating news');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">📰 Add News </h2>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
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
            value={formData.description}
            onChange={handleChange}
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
              <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 1MB</p>

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

export default NewsEdit;
