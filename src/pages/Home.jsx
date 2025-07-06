import StatusChart from "../components/StatusChart";

const Home = () => {
  return (
    <>
      <div className="px-6 md:px-12 lg:px-20 py-4">
        {/* Use grid layout with smaller gap-y and possibly combine in one section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Company</p>
            <h2 className="text-2xl font-bold text-purple-700 mt-1">1,240</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Active Company</p>
            <h2 className="text-2xl font-bold text-blue-600 mt-1">320</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Inactive Company</p>
            <h2 className="text-2xl font-bold text-red-500 mt-1">12</h2>
          </div>
        </div>
      </div>

      {/* Chart section with adjusted padding and height */}
      <div className="px-6 md:px-12 lg:px-20 py-2">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <StatusChart />
        </div>
      </div>

      {/* Buttons section */}
      <div className="px-6 md:px-12 lg:px-20 py-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-wrap justify-evenly items-center gap-4">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Add Company
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Add Notice
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Add News
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
