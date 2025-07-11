import React from "react";

function ViewExpense() {
  // Sample data for the table
  const expenses = [
    { id: 1, amount: 2500, purpose: "Office Supplies" },
    { id: 2, amount: 1500, purpose: "Electricity Bill" },
    { id: 3, amount: 3200, purpose: "Travel Expenses" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-200 rounded-xl shadow-lg">
      
      {/* Expense Table */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Expense Records</h3>
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-left">S.No.</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount (NPR)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(({ id, amount, purpose }) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{id}</td>
                <td className="border border-gray-300 px-4 py-2">{amount}</td>
                <td className="border border-gray-300 px-4 py-2">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewExpense;
