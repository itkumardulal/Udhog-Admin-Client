import React, { useEffect, useState } from "react";
import { API } from "../http";

const CompanyList = () => {
  const headers = {
    sn: "S.N.",
    organizationId: "Organization ID",
    registrationNo: "Registration No",
    nameAndEmail: "Name & Email",
    orgType: "Type",
    industry: "Industry",
    contactPerson: "Contact Person",
    phoneNo: "Phone No",
    vat: "VAT",
    pan: "PAN",
    revenue: "Revenue",
    employees: "Employees",
    renewStatus: "Status"
  };

  const [companies, setCompanies] = useState([]);
  const fetchBook = async () => {
    try {   
      const response = await API.get("company");
        if (response.status === 200) {
          setCompanies(response.data.data);
        } else {
          console.error("Failed to fetch companies:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);  
      }
    }
    useEffect(() => {
      fetchBook();  
    }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Company List
      </h2>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg border-gray-300 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-4">{headers.sn}</th>
                  <th className="p-4">{headers.registrationNo}</th>
                  <th className="p-4">{headers.nameAndEmail}</th>
                  <th className="p-4">{headers.orgType}</th>
                  <th className="p-4">{headers.industry}</th>
                  <th className="p-4">{headers.contactPerson}</th>
                  <th className="p-4">{headers.phoneNo}</th>
                  <th className="p-4">{headers.vat}</th>
                  <th className="p-4">{headers.pan}</th>
                  <th className="p-4">{headers.revenue}</th>
                  <th className="p-4">{headers.employees}</th>
                  <th className="p-4">{headers.renewStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{index + 1}</td>
                    <td className="p-4">{company.registrationNo}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span>{company.name}</span>
                        <span className="text-xs text-gray-400">{company.email}</span>
                      </div>
                    </td>
                    <td className="p-4">{company.type}</td>
                    <td className="p-4">{company.industryType}</td>
                    <td className="p-4">{company.contactPerson}</td>
                    <td className="p-4">{company.phoneNo}</td>
                    <td className="p-4">{company.vat}</td>
                    <td className="p-4">{company.pan}</td>
                    <td className="p-4">{company.annualRevenue}</td>
                    <td className="p-4">{company.noOfEmployee}</td>
                    <td className="p-4">
                      {company.status === "Active" ? (
                        <span className="px-3 py-1 text-green-700 bg-green-100 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-red-700 bg-red-100 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
