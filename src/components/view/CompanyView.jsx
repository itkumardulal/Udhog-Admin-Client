import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // <-- import useNavigate
import { apiAuthenticated } from "../../http";
import { toast } from "react-toastify";

const ViewCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();  // <-- initialize navigate
  const [company, setCompany] = useState(null);

  const fetchCompany = async () => {
    try {
      const res = await apiAuthenticated.get(`/company/${id}`);
      if (res.status === 200) {
        setCompany(res.data.data);
      } else {
        toast.error("Failed to fetch company details.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching company details.");
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleDownload = async (url, label) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${label}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Download failed.");
      console.error("Download error:", error);
    }
  };

  const renderImageBox = (label, url) => (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-full text-center hover:shadow-xl transition duration-300">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">{label}</h4>
      {url ? (
        <>
          <img
            src={url}
            alt={label}
            onClick={() => openModal(url)}
            className="w-full h-64 object-contain border border-gray-200 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleDownload(url, label);
            }}
            className="mt-3 hover:cursor-pointer bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ⬇ Download
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center h-60 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
          No image to preview
        </div>
      )}
    </div>
  );

  if (!company) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/view/companies")}
       className="bg-blue-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded hover:bg-blue-700 transition hover:cursor-pointer"
      >
        Back to Companies
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🏢 {company.companyNameEng}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-2">
          <p><strong>Company Name (Nep):</strong> {company.companyNameNep}</p>
          <p><strong>Email:</strong> {company.email}</p>
          <p><strong>Contact Person:</strong> {company.contactPerson}</p>
          <p><strong>Phone:</strong> {company.phoneNo}</p>
          <p><strong>Tel:</strong> {company.telPhone}</p>
          <p><strong>Address:</strong> {company.address}</p>
          <p><strong>Organization Type:</strong> {company.organizationType}</p>
          <p><strong>Industry Type:</strong> {company.industryType}</p>
          <p><strong>Business Nature:</strong> {company.businessNature}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-2">
          <p><strong>Registration No:</strong> {company.registrationNo}</p>
          <p><strong>Membership No:</strong> {company.membershipNo}</p>
          <p><strong>Registration Date:</strong> {company.registrationDate?.slice(0, 10)}</p>
          <p><strong>Membership Date:</strong> {company.membershipDate?.slice(0, 10)}</p>
          <p><strong>Membership Type:</strong> {company.membershipType}</p>
          <p><strong>Capital:</strong> {company.capital}</p>
          <p><strong>Employees:</strong> {company.numberOfEmployees}</p>
          <p><strong>VAT:</strong> {company.vat || "-"}</p>
          <p><strong>PAN:</strong> {company.pan || "-"}</p>
          <p><strong>Leadership Gender:</strong> {company.leadershipGender}</p>
          <p><strong>Status:</strong> <span className={`font-semibold ${company.renewStatus === "Active" ? "text-green-600" : "text-red-500"}`}>{company.renewStatus}</span></p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">📎 Uploaded Documents</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {renderImageBox("📜 Registration", company.registrationUrl)}
        {renderImageBox("👤 Owner/Company Photo", company.photoUrl)}
        {renderImageBox("🪪 Citizenship Front", company.citizenshipFrontUrl)}
        {renderImageBox("🪪 Citizenship Back", company.citizenshipBackUrl)}
      </div>
    </div>
  );
};

export default ViewCompany;
