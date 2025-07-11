import React from "react";

function AddExpense() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit Expense Details</h2>

      <form>
        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Amount (NPR)</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        {/* Purpose */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Purpose</label>
          <input
            type="text"
            placeholder="Enter purpose"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        {/* Submit Button (UI only) */}
        <div>
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

export default AddExpense;
