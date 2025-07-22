import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiAuthenticated } from "../../http";
import { useNavigate } from "react-router-dom";

const NewsForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (selected.size > 1024 * 1024) {
      toast.error("Image must be less than 1MB");
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      handleFileChange({ target: { files: [dropped] } });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      if (file) form.append("file", file);

      const response = await apiAuthenticated.post("/news", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("News submitted successfully!");
        setTimeout(() => navigate("/view/news"), 2000);
      } else {
        toast.error("Failed to submit news");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📰 Add News</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter news title"
            className="bg-gray-50 border border-gray-300 rounded-lg p-3 w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
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
            Upload Image <span className="text-gray-400">(Optional, max 1MB)</span>
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50"
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
              <p className="mt-2 text-sm text-gray-500">Drag and drop or browse</p>
              {file && <p className="text-green-600 mt-2">Selected: {file.name}</p>}
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
            disabled={
              submitting || !formData.title.trim() || !formData.description.trim()
            }
            className={`px-6 py-3 rounded-lg transition-all shadow-md text-sm font-semibold hover:cursor-pointer ${
              submitting
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit News"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
