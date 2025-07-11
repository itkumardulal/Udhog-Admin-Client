import React, { useState } from "react";

function AddIncome() {
  const [feeType, setFeeType] = useState("");
  const [showOtherDesc, setShowOtherDesc] = useState(false);

  const handleFeeChange = (e) => {
    const value = e.target.value;
    setFeeType(value);
    setShowOtherDesc(value === "Others");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit Fee Details</h2>

      <form>

        {/* Inside / Outside */}
        <div className="mt-6 mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Choose Company Type</label>
          <div className="flex gap-6">
            <label className="flex items-center text-gray-700">
              <input type="radio" name="area" value="Inside" className="mr-2 accent-indigo-600" />
              Inside
            </label>
            <label className="flex items-center text-gray-700">
              <input type="radio" name="area" value="Outside" className="mr-2 accent-indigo-600" />
              Outside
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Company Name</label>
            <input
              type="text"
              placeholder="Enter company name"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Amount (NPR)</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>

        </div>


        {/* Fee Type Dropdown */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Purpose</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-indigo-600 focus:border-indigo-600"
            onChange={handleFeeChange}
            value={feeType}
          >
      
            <option value="Home Rent">Home Rent</option>
            <option value="Registration Fee">Registration Fee</option>
            <option value="Renewal Fee">Renewal Fee</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Show if "Others" is selected */}
        {showOtherDesc && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <textarea
              placeholder="Provide a description..."
              rows="3"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-indigo-600 focus:border-indigo-600"
            ></textarea>
          </div>
        )}

        {/* Submit Button (UI only) */}
        <div className="mt-8">
          <button
            type="button"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md text-sm font-semibold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddIncome;
