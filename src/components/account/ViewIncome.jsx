import React, { useState } from "react";

function ViewIncome() {
  const [feeType, setFeeType] = useState("");
  const [showOtherDesc, setShowOtherDesc] = useState(false);

  // For demo: sample data entries for the table
  const [incomes, setIncomes] = useState([
    {
      id: 1,
      area: "Inside",
      companyName: "ABC Pvt Ltd",
      amount: 25000,
      feeType: "Home Rent",
      description: "",
    },
    {
      id: 2,
      area: "Outside",
      companyName: "XYZ Enterprises",
      amount: 15000,
      feeType: "Others",
      description: "Consulting fee",
    },
    {
      id: 3,
      area: "Inside",
      companyName: "Global Tech",
      amount: 30000,
      feeType: "Registration Fee",
      description: "",
    },
  ]);

  const handleFeeChange = (e) => {
    const value = e.target.value;
    setFeeType(value);
    setShowOtherDesc(value === "Others");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">

      {/* Table View Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Submitted Fees</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-indigo-50 text-indigo-700 text-left">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300">Company Type</th>
                <th className="px-4 py-2 border-b border-gray-300">Company Name</th>
                <th className="px-4 py-2 border-b border-gray-300">Amount (NPR)</th>
                <th className="px-4 py-2 border-b border-gray-300">Purpose</th>
                <th className="px-4 py-2 border-b border-gray-300">Description</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-300">{income.area}</td>
                  <td className="px-4 py-2 border-b border-gray-300">{income.companyName}</td>
                  <td className="px-4 py-2 border-b border-gray-300">{income.amount}</td>
                  <td className="px-4 py-2 border-b border-gray-300">{income.feeType}</td>
                  <td className="px-4 py-2 border-b border-gray-300">{income.description || "-"}</td>
                </tr>
              ))}
              {incomes.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewIncome;
