import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiAuthenticated } from '../../http';
import 'react-toastify/dist/ReactToastify.css';

const NewsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // File info states
  const [selectedFile, setSelectedFile] = useState(null); // new file to upload
  const [imageUrl, setImageUrl] = useState(''); // current stored image url
  const [imageName, setImageName] = useState(''); // current stored image name
  const [preview, setPreview] = useState(''); // preview src (new or existing)

  const [uploading, setUploading] = useState(false);

  // Fetch news data on mount
  useEffect(() => {
    fetchNewsData();
  }, []);

  // Update preview if imageUrl changes and no new file selected
  useEffect(() => {
    if (imageUrl && !selectedFile) {
      setPreview(imageUrl);
    }
  }, [imageUrl, selectedFile]);

  // Fetch existing news
  const fetchNewsData = async () => {
    try {
      const response = await apiAuthenticated.get(`/news/${id}`);
      if (response.status === 200) {
        const news = response.data.data;
        setFormData({ title: news.title, description: news.description });
        setImageName(news.imgName || '');
        setImageUrl(news.imgUrl || '');
        setPreview(news.imgUrl || '');
      } else {
        toast.error('Failed to fetch news data');
      }
    } catch (error) {
      toast.error('Error fetching news data');
    }
  };

  // Preview file locally
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
  };

  // When user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.error('File size must be less than 1MB.');
      return;
    }

    setSelectedFile(file);
    previewFile(file);
  };

  // Remove selected or existing image
  const removeImage = () => {
    setSelectedFile(null);
    setPreview('');
    setImageUrl('');
    setImageName('');
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated news
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please provide title and description.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);

    if (selectedFile) {
      data.append('file', selectedFile);
    } else {
      // Send existing image info if no new file
      data.append('imgUrl', imageUrl);
      data.append('imgName', imageName);
    }

    setUploading(true);
    try {
      const response = await apiAuthenticated.patch(`/news/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        toast.success('News updated successfully!');
        navigate('/view/news');
      } else {
        toast.error('Failed to update news.');
      }
    } catch (error) {
      toast.error('Error updating news.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">📰 Edit News</h2>
      <form className="space-y-8" onSubmit={handleSubmit}>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter news title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            placeholder="Enter news description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Upload Image <span className="text-gray-400">(Max 1MB)</span>
          </label>
          {!preview ? (
            <div className="relative cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center hover:border-indigo-600"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileChange({ target: { files: [file] } });
              }}>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <img
                className="mx-auto mb-2 h-12 w-12"
                src="https://www.svgrepo.com/show/357902/image-upload.svg"
                alt="Upload"
              />
              <p className="text-sm font-medium text-gray-900">
                Drag and drop or <span className="text-indigo-600">browse</span> to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 1MB</p>
              {uploading && <p className="mt-2 text-blue-500 text-sm">Uploading...</p>}
            </div>
          ) : (
            <div className="relative w-fit mx-auto mt-2">
              <img src={preview} alt="Preview" className="max-h-40 rounded border shadow-md" />
              <button
                type="button"
                onClick={removeImage}
                title="Remove image"
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
              >
                ✕
              </button>
              <p className="mt-1 text-center text-green-600 text-sm">Uploaded: {selectedFile ? selectedFile.name : imageName}</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-50 hover:cursor-pointer"
          >
            {uploading ? 'Updating...' : 'Update News'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsEdit;
