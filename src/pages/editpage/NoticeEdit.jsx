import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiAuthenticated } from "../../http";
import "react-toastify/dist/ReactToastify.css";

const NoticeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        const res = await apiAuthenticated.get(`/notices/${id}`);
        if (res.status === 200) {
          const notice = res.data.data;
          setFormData({
            title: notice.title || "",
            description: notice.description || "",
          });
          setPdfName(notice.pdfName || "");
          setPdfUrl(notice.pdfUrl || "");
        } else {
          toast.error("Failed to fetch notice data");
        }
      } catch (err) {
        toast.error("Error fetching notice");
      } finally {
        setLoading(false);
      }
    };
    fetchNoticeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    setSelectedFile(file);
    setPdfName(file.name);
    setPdfUrl("");
  };

  const removePDF = () => {
    setSelectedFile(null);
    setPdfName("");
    setPdfUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please provide title and description.");
      return;
    }

    setUploading(true);

    try {
      if (selectedFile) {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("file", selectedFile);

        const res = await apiAuthenticated.patch(`/notices/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 200) {
          toast.success("Notice updated successfully!");
          navigate("/view/notices");
        } else {
          toast.error("Failed to update notice.");
        }
      } else {
        const payload = {
          ...formData,
          pdfName,
          pdfUrl,
        };

        const res = await apiAuthenticated.patch(`/notices/${id}`, payload);

        if (res.status === 200) {
          toast.success("Notice updated successfully!");
          navigate("/view/notices");
        } else {
          toast.error("Failed to update notice.");
        }
      }
    } catch (error) {
      toast.error("Error updating notice.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading notice...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">📄 Edit Notice</h2>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block mb-2 font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter notice title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block mb-2 font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            placeholder="Enter notice description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Upload PDF <span className="text-gray-400">(Max 10MB)</span>
          </label>

          <div
            className="relative cursor-pointer border-2 border-dashed rounded-lg p-6 bg-gray-50 text-center max-w-3xl mx-auto
            hover:border-indigo-600
            border-gray-300
            "
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFileChange({ target: { files: [file] } });
            }}
          >
            {!pdfName && (
              <>
                <input
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-14 w-14 text-gray-400"
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
                <p className="text-sm font-medium text-gray-900 mt-2">
                  Drag and drop or{" "}
                  <span className="text-indigo-600">browse</span> to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF only. Max 10MB
                </p>
                {uploading && (
                  <p className="mt-2 text-blue-500 text-sm">Uploading...</p>
                )}
              </>
            )}

            {pdfName && (
              <>
                <p className="text-green-600 text-lg font-semibold truncate">
                  📄 {pdfName}
                </p>
                <button
                  type="button"
                  onClick={removePDF}
                  title="Remove PDF"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-50 hover:cursor-pointer"
          >
            {uploading ? "Updating..." : "Update Notice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeEdit;
