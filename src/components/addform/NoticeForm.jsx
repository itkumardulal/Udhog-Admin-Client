import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { apiAuthenticated } from "../../http";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const NoticeForm = () => {
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file || file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDF must be under 10MB.");
      return;
    }

    setPdfFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!pdfFile) {
      toast.error("Please upload a PDF file.");
      return;
    }

    setSubmitting(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("file", pdfFile);

    try {
      const res = await apiAuthenticated.post("/notices", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast.success("Notice submitted successfully!");
        setFormData({ title: "", description: "" });
        setPdfFile(null);
        fileInputRef.current.value = "";
        setTimeout(() => navigate("/view/notices"), 2000);
      } else {
        toast.error("Failed to submit notice.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
        📢 Add Notice
      </h2>

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
            placeholder="Enter notice title"
            required
            className="bg-gray-50 border border-gray-300 rounded-lg p-3 w-full"
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
            placeholder="Enter notice details..."
            required
            className="bg-gray-50 border border-gray-300 rounded-lg p-3 w-full resize-none"
          ></textarea>
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF <span className="text-gray-400">(Max 10MB)</span>
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-indigo-500 transition cursor-pointer"
          >
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 z-50 cursor-pointer"
            />

            <div className="text-center">
              {/* Hide the upload icon and instructions if PDF is uploaded */}
              {!pdfFile && (
                <>
                  {/* SVG Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                    />
                  </svg>
                  <p className="text-sm text-gray-700 font-medium mt-2">
                    Drag and drop
                    <span className="text-indigo-600"> or browse </span>
                    to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Only PDF files under 10MB
                  </p>
                </>
              )}

              {/* Show uploaded file name */}
              {pdfFile && (
                <p className="mt-2 text-green-600 text-sm truncate">
                  Selected PDF: {pdfFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-3 rounded-lg transition-all shadow-md text-sm font-semibold hover:cursor-pointer ${
              submitting
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Notice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;
