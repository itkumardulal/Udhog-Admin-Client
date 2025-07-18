import StatusChart from "../components/StatusChart";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Company Stats Data
  const companyStats = [
    { label: "Total Company", value: "1,240", color: "text-purple-700" },
    { label: "Active Company", value: "320", color: "text-blue-600" },
    { label: "Inactive Company", value: "12", color: "text-red-500" },
  ];

  // Action Buttons Data
  const buttons = [
    { label: "Add Company", color: "bg-purple-600 hover:bg-purple-700", path: "/add/company" },
    { label: "Add Notice", color: "bg-blue-600 hover:bg-blue-700", path: "/add/notice" },
    { label: "Add News", color: "bg-green-600 hover:bg-green-700", path: "/add/news" },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Top Stats */}
      <div className="px-6 md:px-12 lg:px-20 py-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companyStats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h2 className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Chart section */}
      <div className="px-6 md:px-12 lg:px-20 py-2 flex-grow">
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
          <StatusChart />
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
