import React, { useEffect, useState } from "react";
import * as filestack from "filestack-js";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiAuthenticated } from "../../http";

const client = filestack.init(import.meta.env.VITE_FILESTACK_API_KEY);

const NoticeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [uploading, setUploading] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNoticeData = async () => {
    try {
      const res = await apiAuthenticated.get(`/notices/${id}`);
      if (res.status === 200) {
        const notice = res.data.data;

        setFormData({
          title: notice.title || "",
          description: notice.description || "",
        });
        setPdfName(notice.pdfName  || "");
        setPdfUrl(notice.pdfUrl  || "");
      } else {
        toast.error("Failed to fetch notice data");
      }
    } catch (err) {
      toast.error("Error fetching notice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticeData();
  }, []);

  const handlePdfUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      const result = await client.upload(file);
      setPdfName(result.filename);
      setPdfUrl(result.url);
      toast.success("PDF uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload PDF");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pdfName,
      pdfUrl,
    };

    try {
      const response = await apiAuthenticated.patch(`/notices/${id}`, payload);
      if (response.status === 200) {
        toast.success("Notice updated successfully!");
        navigate("/view/notices");
      } else {
        toast.error("Failed to update notice");
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Something went wrong.";
      toast.error(message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading notice...</p>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">✏️ Edit Notice</h2>

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
            placeholder="Enter notice title"
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
            placeholder="Enter notice description..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 shadow-sm resize-none"
            required
          ></textarea>
        </div>

        {/* PDF Upload */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF <span className="text-gray-400">(Max 10MB)</span>
          </label>
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 cursor-pointer hover:border-indigo-600 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
              onChange={handleFileChange}
            />
            <div className="text-center">
              <img
                className="mx-auto h-12 w-12"
                src="https://www.svgrepo.com/show/530556/pdf.svg"
                alt="Upload"
              />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Drag and drop
                <span className="text-indigo-600"> or browse </span>
                to upload
              </h3>
              <p className="mt-1 text-xs text-gray-500">PDF only. Max 10MB</p>

              {uploading && <p className="text-blue-500 text-sm mt-2">Uploading...</p>}
              {!uploading && pdfName && (
                <p className="text-green-600 text-sm mt-2">Uploaded: {pdfName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 
            transition-all shadow-md text-sm font-semibold hover:cursor-pointer"
          >
            Update Notice
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeEdit;
