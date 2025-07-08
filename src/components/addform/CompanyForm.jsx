import React, { useState, useRef } from 'react';
import * as filestack from 'filestack-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiAuthenticated } from '../../http';




const apikey = import.meta.env.VITE_FILESTACK_API_KEY;
const client = filestack.init(apikey);

const CompanyForm = () => {
  const [data, setData] = useState({
    registrationNo: '',
    companyNameEng: '',
    companyNameNep: '',
    email: '',
    organizationType: '',
    industry: '',
    contactPerson: '',
    phoneNo: '',
    numberOfEmployees: '',
    annualRevenue: '',
    renewStatus: 'Active',
    vat: '',
    pan: '',
    description: '',
  });

  const [idType, setIdType] = useState('vat');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { ...data, pdfUrl, pdfName };
      const response = await apiAuthenticated.post('/company', payload);

      if (response.status === 201) {
        toast.success('Company details submitted successfully!');
        setData({
          registrationNo: '',
          companyNameEng: '',
          companyNameNep: '',
          email: '',
          organizationType: '',
          industry: '',
          contactPerson: '',
          phoneNo: '',
          numberOfEmployees: '',
          annualRevenue: '',
          renewStatus: 'Active',
          vat: '',
          pan: '',
          description: '',
        });
        setIdType('vat');
        setPdfUrl('');
        setPdfName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = null; 
        }
      } else {
        toast.error("Failed to submit company details");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'An error occurred.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomPdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('PDF must be less than 10MB.');
      return;
    }

    try {
      setUploading(true);
      const result = await client.upload(file, {}, {}, { filename: file.name });
      setPdfUrl(result.url);
      setPdfName(result.filename);
      toast.success('PDF uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload PDF.');
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Company Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { id: "registrationNo", label: "Registration No", type: "number", placeholder: "223344" },
            { id: "companyNameEng", label: "Company Name (English)", type: "text", placeholder: "Nepal Digital Media Hub" },
            { id: "companyNameNep", label: "Company Name (Nepali)", type: "text", placeholder: "नेपाल डिजिटल मिडिया हब" },
            { id: "email", label: "Email", type: "email", placeholder: "admin@ndmh.com.np" },
            { id: "organizationType", label: "Organization Type", type: "text", placeholder: "Private" },
            { id: "industry", label: "Industry Type", type: "text", placeholder: "Media & Entertainment" },
            { id: "contactPerson", label: "Owner Name", type: "text", placeholder: "Kriti Joshi" },
            { id: "phoneNo", label: "Phone Number", type: "tel", placeholder: "9808765432" },
            { id: "numberOfEmployees", label: "Number of Employees", type: "number", placeholder: "35" },
            { id: "annualRevenue", label: "Annual Revenue", type: "number", placeholder: "8500000" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="text-sm font-medium text-gray-900 block mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                placeholder={field.placeholder}
                value={data[field.id]}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
                focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                required
                onChange={handleChange}
              />
            </div>
          ))}

          <div>
            <label htmlFor="renewStatus" className="text-sm font-medium text-gray-900 block mb-2">
              Renew Status
            </label>
            <select
              id="renewStatus"
              name="renewStatus"
              value={data.renewStatus}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
              focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* VAT/PAN Selection */}
        <div className="mt-10">
          <label className="block text-sm font-medium text-gray-900 mb-2">Choose VAT/PAN</label>
          <div className="flex space-x-6">
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                name="idType"
                value="vat"
                checked={idType === 'vat'}
                onChange={() => setIdType('vat')}
                className="mr-2 accent-indigo-600"
              />
              VAT
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                name="idType"
                value="pan"
                checked={idType === 'pan'}
                onChange={() => setIdType('pan')}
                className="mr-2 accent-indigo-600"
              />
              PAN
            </label>
          </div>

          <div className="mt-4">
            {idType === 'vat' && (
              <div>
                <label htmlFor="vat" className="text-sm font-medium text-gray-900 block mb-2">VAT Number</label>
                <input
                  type="text"
                  id="vat"
                  name="vat"
                  value={data.vat}
                  onChange={handleChange}
                  placeholder="Enter VAT Number"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
                  focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  required
                />
              </div>
            )}
            {idType === 'pan' && (
              <div>
                <label htmlFor="pan" className="text-sm font-medium text-gray-900 block mb-2">PAN Number</label>
                <input
                  type="text"
                  id="pan"
                  name="pan"
                  value={data.pan}
                  onChange={handleChange}
                  placeholder="Enter PAN Number"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
                  focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  required
                />
              </div>
            )}
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

        {/* PDF Upload */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-900 block mb-2">Upload Company PDF</label>
          <div className="relative group border-2 border-dashed border-blue-500 bg-gray-50 rounded-lg h-32 flex flex-col justify-center items-center hover:bg-blue-50 transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-600 mb-1 transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".3" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8v-2h8v2zm0 4H8v-2h8v2z" />
            </svg>
            <span className="text-gray-500 text-xs">Click to upload PDF (max 10MB)</span>
            {uploading && <span className="text-blue-600 text-xs mt-1">Uploading...</span>}
            {!uploading && pdfName && (
              <span className="text-green-600 text-xs mt-1 truncate w-[80%] text-center">{pdfName}</span>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={handleCustomPdfUpload}
              ref={fileInputRef}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md text-sm font-semibold flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Company Info'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
