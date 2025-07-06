import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import logo5 from '../assets/logo5.png';

const DashboardLayout = () => {
  const [openAddMenu, setOpenAddMenu] = useState(false);
  const [openViewMenu, setOpenViewMenu] = useState(false);
  const location = useLocation();

  // Add submenu
  const addSubmenu = [
    {
      name: 'Company Details',
      path: '/add/company',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 21V5a2 2 0 012-2h6v18H3z"
        />
      ),
    },
    {
      name: 'News',
      path: '/add/news',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2z"
        />
      ),
    },
    {
      name: 'Notices',
      path: '/add/notices',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m0-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
        />
      ),
    },
  ];

  // View submenu with same icon style
  const viewSubmenu = [
    {
      name: 'View Companies',
      path: '/view/companies',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 21V5a2 2 0 012-2h6v18H3z"
        />
      ),
    },
    {
      name: 'View News',
      path: '/view/news',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2z"
        />
      ),
    },
    {
      name: 'View Notices',
      path: '/view/notices',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m0-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
        />
      ),
    },
  ];

  const menuItems = [
    {
      name: 'Home',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
      active: location.pathname === '/',
      path: '/',
    },
    {
      name: 'Add',
      type: 'dropdown',
      icon: (
        <>
          <circle cx="12" cy="12" r="10" fill="#6366F1" />
          <path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v8m-4-4h8"
            fill="none"
          />
        </>
      ),
      children: addSubmenu,
    },
    {
      name: 'View',
      type: 'dropdown',
      icon: (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </>
      ),
      children: viewSubmenu,
    },
  ];

  return (
    <div className="bg-gray-100 h-screen flex">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <div className="flex flex-col items-center md:items-start">
            <img src={logo5} alt="Logo" className="h-12 w-auto mb-2" />
            <span className="text-lg font-semibold text-gray-800">Admin Dashboard</span>
          </div>
        </div>

        <nav className="mt-5 px-2">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.type === 'dropdown' ? (
                <>
                  <button
                    onClick={() => {
                      if (item.name === 'Add') setOpenAddMenu(!openAddMenu);
                      if (item.name === 'View') setOpenViewMenu(!openViewMenu);
                    }}
                    className="w-full flex items-center px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                  >
                    <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {item.icon}
                    </svg>
                    <span className="ml-3 hidden md:inline">{item.name}</span>
                    <svg
                      className="ml-auto h-4 w-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {(item.name === 'Add' && openAddMenu) && (
                    <div className="ml-0 md:ml-6 mt-1 space-y-1">
                      {item.children.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            location.pathname === sub.path
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <svg
                            className="h-6 w-6 text-gray-400 group-hover:text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {sub.icon}
                          </svg>
                          <span className="ml-3 hidden md:inline">{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {(item.name === 'View' && openViewMenu) && (
                    <div className="ml-0 md:ml-6 mt-1 space-y-1">
                      {item.children.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            location.pathname === sub.path
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <svg
                            className="h-6 w-6 text-gray-400 group-hover:text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {sub.icon}
                          </svg>
                          <span className="ml-3 hidden md:inline">{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    item.active
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className={`h-6 w-6 ${
                      item.active
                        ? 'text-indigo-700'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {item.icon}
                  </svg>
                  <span className="ml-3 hidden md:inline">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto p-4 border-t">
          <button
            className="w-full flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            <span className="hidden md:inline ml-2">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
