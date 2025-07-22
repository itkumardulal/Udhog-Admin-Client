import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiAuthenticated } from "../../http";

const CompanyForm = () => {
  const navigate = useNavigate();

  const selectFields = [
    {
      label: "Organization Type",
      id: "organizationType",
      name: "organizationType",
      options: ["Private", "Partnership", "Individual"],
    },
    {
      label: "Membership Type",
      id: "membershipType",
      name: "membershipType",
      options: ["Lifetime", "Normal", "Associate", "Sakha", "Manyartha", "Bastugat"],
    },
    {
      label: "Business Nature",
      id: "businessNature",
      name: "businessNature",
      options: ["Udhog", "Badihya", "Nikaya"],
    },
    {
      label: "Renew Status",
      id: "renewStatus",
      name: "renewStatus",
      options: ["Active", "Inactive"],
    },
    {
      label: "Leadership Gender",
      id: "leadershipGender",
      name: "leadershipGender",
      options: ["Male", "Female", "Others"],
    },
    {
      label: "Industry Type",
      id: "industryType",
      name: "industryType",
      options: ["Media", "IT", "Suppliers", "Manufacturing", "NGO", "Others"],
    },
  ];

  const [data, setData] = useState({
    registrationNo: "",
    companyNameEng: "",
    companyNameNep: "",
    address: "",
    email: "",
    organizationType: "Private",
    contactPerson: "",
    phoneNo: "",
    numberOfEmployees: "",
    capital: "",
    renewStatus: "Active",
    vat: "",
    pan: "",
    description: "",
    registrationDate: "",
    membershipDate: "",
    membershipNo: "",
    membershipType: "Lifetime",
    industryType: "IT",
    businessNature: "Udhog",
    telPhone: "",
    leadershipGender: "Male",
  });

  const [customIndustry, setCustomIndustry] = useState("");
  const [idType, setIdType] = useState("vat");
  const [fileInputs, setFileInputs] = useState({
    registration: null,
    citizenshipFront: null,
    citizenshipBack: null,
    photo: null,
  });
  const [fileNames, setFileNames] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "industryType" && value !== "Others") {
      setCustomIndustry("");
    }
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomIndustryChange = (e) => {
    setCustomIndustry(e.target.value);
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const maxSize = 1 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(`${field} must be under 1MB`);
      return;
    }

    if (!isImage) {
      toast.error(`${field} must be an image`);
      return;
    }

    setFileInputs((prev) => ({ ...prev, [field]: file }));
    setFileNames((prev) => ({ ...prev, [field]: file.name }));
    toast.success(`${field} img uploaded successfully`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const industryValue =
        data.industryType === "Others" && customIndustry.trim() !== ""
          ? customIndustry.trim()
          : data.industryType;

      const formData = new FormData();
      Object.entries({
        ...data,
        industryType: industryValue,
      }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append files
      if (fileInputs.registration) formData.append("registration", fileInputs.registration);
      if (fileInputs.citizenshipFront) formData.append("citizenshipFront", fileInputs.citizenshipFront);
      if (fileInputs.citizenshipBack) formData.append("citizenshipBack", fileInputs.citizenshipBack);
      if (fileInputs.photo) formData.append("photo", fileInputs.photo);

      const res = await apiAuthenticated.post("/company", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast.success("Company added successfully!");
        setTimeout(() => navigate("/view/companies"), 3000);
      } else {
        toast.error("Failed to submit");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const FileUploadField = ({ id, label }) => (
    <div className="mt-6">
      <label className="text-sm font-medium text-gray-900 block mb-2">{label}</label>
      <div className="relative group border-2 border-dashed border-blue-500 bg-gray-50 rounded-lg h-32 flex flex-col justify-center items-center hover:bg-blue-50 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-600 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".3" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8v-2h8v2zm0 4H8v-2h8v2z" />
        </svg>
        <span className="text-gray-500 text-xs">Click to upload image (max 1MB)</span>
        {fileNames[id] && (
          <span className="text-green-600 text-xs mt-1 truncate w-[80%] text-center">{fileNames[id]}</span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, id)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Company Details</h2>

      <form onSubmit={handleSubmit}>
        <h3 className="text-2xl font-semibold text-gray-500 mb-8 text-center">Company Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { id: "registrationNo", label: "Registration No", type: "number", placeholder: "223344" },
            { id: "membershipNo", label: "Membership No", type: "number", placeholder: "1234567", required: true },
            { id: "companyNameEng", label: "Company Name (English)", type: "text", placeholder: "Nepal Digital Media Hub" },
            { id: "companyNameNep", label: "Company Name (Nepali)", type: "text", placeholder: "नेपाल डिजिटल मिडिया हब" },
            { id: "email", label: "Email", type: "email", placeholder: "admin@ndmh.com.np" },
            { id: "telPhone", label: "Telephone", type: "tel", placeholder: "9808765432" },
            { id: "address", label: "Address", type: "text", placeholder: "Bazar", required: true },
            { id: "numberOfEmployees", label: "Number of Employees", type: "number", placeholder: "35" },
            { id: "capital", label: "Capital", type: "number", placeholder: "8500000" },
            { id: "registrationDate", label: "Registration Date", type: "date" },
            { id: "membershipDate", label: "Membership Date", type: "date" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="text-sm font-medium text-gray-900 block mb-2">
                {field.label} {field.required && <span className="text-red-500 text-lg">*</span>}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                placeholder={field.placeholder}
                value={data[field.id]}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
                focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                required={field.required || false}
              />
            </div>
          ))}

          {selectFields.map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="text-sm font-medium text-gray-900 block mb-2">
                {field.label}
              </label>
              <select
                id={field.id}
                name={field.name}
                value={data[field.name]}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
                focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                required
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              {field.name === "industryType" && data.industryType === "Others" && (
                <input
                  type="text"
                  value={customIndustry}
                  onChange={handleCustomIndustryChange}
                  placeholder="Please specify your Industry Type"
                  className="mt-2 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg
                   focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  required
                />
              )}
            </div>
          ))}
        </div>

        {/* VAT / PAN Section */}
        <div className="mt-10">
          <label className="block text-sm font-medium text-gray-900 mb-2">Choose VAT/PAN</label>
          <div className="flex space-x-6">
            {["vat", "pan"].map((type) => (
              <label key={type} className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="idType"
                  value={type}
                  checked={idType === type}
                  onChange={() => setIdType(type)}
                  className="mr-2 accent-indigo-600"
                />
                {type.toUpperCase()}
              </label>
            ))}
          </div>

          <div className="mt-4">
            <label htmlFor={idType} className="text-sm font-medium text-gray-900 block mb-2">
              {idType.toUpperCase()} Number
            </label>
            <input
              type="text"
              id={idType}
              name={idType}
              value={data[idType]}
              onChange={handleChange}
              placeholder={`Enter ${idType.toUpperCase()} Number`}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
              focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <label htmlFor="description" className="text-sm font-medium text-gray-900 block mb-2">
            Company Description
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Enter a brief description about the company..."
            rows="4"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
            focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
          ></textarea>
        </div>

        {/* File Uploads */}
        <FileUploadField id="registration" label="Registration Upload" />

        <h3 className="text-2xl font-semibold text-gray-500 my-8 text-center">Owner Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { id: "contactPerson", label: "Owner Name", type: "text" },
            { id: "phoneNo", label: "Phone Number", type: "tel" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="text-sm font-medium text-gray-900 block mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                placeholder={field.label}
                value={data[field.id]}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
                focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
            </div>
          ))}
        </div>

        <FileUploadField id="citizenshipFront" label="Citizenship Front" />
        <FileUploadField id="citizenshipBack" label="Citizenship Back" />
        <FileUploadField id="photo" label="Owner Photo" />

        <div className="mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md text-sm font-semibold flex items-center justify-center gap-2 hover:cursor-pointer"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Company Info"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
