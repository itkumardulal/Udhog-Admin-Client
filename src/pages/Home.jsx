import React, { useEffect, useState } from "react";
import StatusChart from "../components/StatusChart";
import { useNavigate } from "react-router-dom";
import { apiAuthenticated } from "../http";

const Home = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyStats = async () => {
      try {
        const res = await apiAuthenticated.get("/company/public");
        setCompanies(res.data?.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch company data:", err);
        setLoading(false);
      }
    };

    fetchCompanyStats();
  }, []);

  const total = companies.length;
  const active = companies.filter(c => c.renewStatus === "Active").length;
  const inactive = companies.filter(c => c.renewStatus === "Inactive").length;

  const formatNumber = (num) => num.toLocaleString();

  const buttons = [
    { label: "Add Company", color: "bg-purple-600 hover:bg-purple-700", path: "/add/company" },
    { label: "Add Notice", color: "bg-blue-600 hover:bg-blue-700", path: "/add/notices" },
    { label: "Add News", color: "bg-green-600 hover:bg-green-700", path: "/add/news" },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Top Stats */}
      <div className="px-6 md:px-12 lg:px-20 py-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Company</p>
            <h2 className="text-2xl font-bold mt-1 text-purple-700">
              {loading ? "..." : formatNumber(total)}
            </h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Active Company</p>
            <h2 className="text-2xl font-bold mt-1 text-blue-600">
              {loading ? "..." : formatNumber(active)}
            </h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Inactive Company</p>
            <h2 className="text-2xl font-bold mt-1 text-red-500">
              {loading ? "..." : formatNumber(inactive)}
            </h2>
          </div>
        </div>
      </div>

      {/* Chart section */}
      <div className="px-6 md:px-12 lg:px-20 py-2 flex-grow">
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
          <StatusChart companies={companies} />
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 md:px-12 lg:px-20 pb-10">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-wrap justify-evenly items-center gap-4">
            {buttons.map((btn, index) => (
              <button
                key={index}
                className={`${btn.color} text-white px-6 py-2 rounded-lg hover:cursor-pointer`}
                onClick={() => navigate(btn.path)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
