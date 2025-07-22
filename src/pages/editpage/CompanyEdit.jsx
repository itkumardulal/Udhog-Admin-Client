import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiAuthenticated } from "../../http";

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
    options: ["Lifetime", "Normal", "Associate", "Sakha", "Manyartha","Bastugat"],
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

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return isNaN(d) ? "" : d.toISOString().split("T")[0];
};

const CompanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [idType, setIdType] = useState("vat");
  const [fileInputs, setFileInputs] = useState({
    registration: null,
    citizenshipFront: null,
    citizenshipBack: null,
    photo: null,
  });
  const [fileUrls, setFileUrls] = useState({
    registration: "",
    citizenshipFront: "",
    citizenshipBack: "",
    photo: "",
  });
  const [fileNames, setFileNames] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState("");

  const fetchData = async () => {
    try {
      const res = await apiAuthenticated.get(`/company/${id}`);
      if (res.status === 200) {
        const companyData = res.data.data;
        const formatted = {
          ...companyData,
          registrationDate: formatDate(companyData.registrationDate),
          membershipDate: formatDate(companyData.membershipDate),
        };
        setData(formatted);
        setIdType(companyData.vat ? "vat" : "pan");
        setFileUrls({
          registration: companyData.registrationUrl || "",
          citizenshipFront: companyData.citizenshipFrontUrl || "",
          citizenshipBack: companyData.citizenshipBackUrl || "",
          photo: companyData.photoUrl || "",
        });

        const industryOptions = selectFields.find(
          (f) => f.id === "industryType"
        ).options;
        if (!industryOptions.includes(companyData.industryType)) {
          setOtherIndustry(companyData.industryType || "");
          setData((prev) => ({ ...prev, industryType: "Others" }));
        }
      }
    } catch (err) {
      toast.error("Failed to fetch company details");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIndustryChange = (e) => {
    const value = e.target.value;
    if (value !== "Others") {
      setOtherIndustry("");
      setData((prev) => ({ ...prev, industryType: value }));
    } else {
      setData((prev) => ({ ...prev, industryType: "Others" }));
    }
  };

  const handleOtherIndustryChange = (e) => {
    setOtherIndustry(e.target.value);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 1024 * 1024) {
      return toast.error(`${field} must be an image under 1MB.`);
    }

    setFileInputs((prev) => ({ ...prev, [field]: file }));
    setFileNames((prev) => ({ ...prev, [field]: file.name }));
    toast.success(`${field} selected successfully`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const industryValue =
        data.industryType === "Others" ? otherIndustry : data.industryType;

      const formData = new FormData();
      Object.entries({
        ...data,
        industryType: industryValue,
        vat: idType === "vat" ? data.vat : null,
        pan: idType === "pan" ? data.pan : null,
      }).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      // Append files if newly uploaded, else send previous URLs to retain
      ["registration", "citizenshipFront", "citizenshipBack", "photo"].forEach(
        (key) => {
          if (fileInputs[key]) {
            formData.append(key, fileInputs[key]);
          } else if (fileUrls[key]) {
            formData.append(`${key}Url`, fileUrls[key]);
          }
        }
      );

      const res = await apiAuthenticated.patch(`/company/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Company updated!");
        setTimeout(() => navigate("/view/companies"), 3000);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  const FileUploadField = ({ id, label }) => (
    <div className="mt-6">
      <label className="text-sm font-medium text-gray-900 block mb-2">
        {label}
      </label>
      <div className="relative group border-2 border-dashed border-blue-500 bg-gray-50 rounded-lg h-32 flex flex-col justify-center items-center hover:bg-blue-50 transition-colors duration-300 overflow-hidden">
        {!fileNames[id] && !fileUrls[id] && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-600 mb-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".3" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8v-2h8v2zm0 4H8v-2h8v2z" />
            </svg>

            <span className="text-gray-500 text-xs">
              Click to upload image (max 1MB)
            </span>
          </>
        )}
        {(fileNames[id] || (!fileNames[id] && fileUrls[id])) && (
          <span className="text-green-600 text-xs mt-1 truncate w-full text-center">
            {fileNames[id] || fileUrls[id].split("/").pop()}
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, id)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Edit Company Details
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            "registrationNo",
            "membershipNo",
            "companyNameEng",
            "companyNameNep",
            "email",
            "telPhone",
            "address",
            "numberOfEmployees",
            "capital",
            "registrationDate",
            "membershipDate",
          ].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type={
                  field.includes("Date")
                    ? "date"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                id={field}
                name={field}
                value={data[field] || ""}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
            </div>
          ))}

          {selectFields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {field.label}
              </label>
              <select
                id={field.id}
                name={field.name}
                value={data[field.name] || field.options[0]}
                onChange={
                  field.id === "industryType"
                    ? handleIndustryChange
                    : handleChange
                }
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {field.id === "industryType" &&
                data.industryType === "Others" && (
                  <input
                    type="text"
                    value={otherIndustry}
                    onChange={handleOtherIndustryChange}
                    placeholder="Please specify industry type"
                    className="mt-2 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                    required
                  />
                )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Choose VAT/PAN
          </label>
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
            <label
              htmlFor={idType}
              className="text-sm font-medium text-gray-900 block mb-2"
            >
              {idType.toUpperCase()} Number
            </label>
            <input
              type="text"
              id={idType}
              name={idType}
              value={data[idType] || ""}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
            />
          </div>
        </div>

        <div className="mt-8">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-900 block mb-2"
          >
            Company Description
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description || ""}
            onChange={handleChange}
            rows="4"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
          />
        </div>

        <FileUploadField id="registration" label="Registration Upload" />
        <h3 className="text-2xl font-semibold text-gray-500 my-8 text-center">
          Owner Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["contactPerson", "phoneNo"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {field === "contactPerson" ? "Owner Name" : "Phone Number"}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={data[field] || ""}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
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
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md text-sm font-semibold hover:cursor-pointer"
          >
            {submitting ? "Updating..." : "Update Company Info"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyEdit;
