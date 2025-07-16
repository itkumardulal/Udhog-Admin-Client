import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo2.png';
import { useState } from 'react';
import { API } from '../../http';


const Login = () => {
const navigate = useNavigate()
 const [data,setData]=useState({
      email:'',
      password:''
  })
   const handleChange= (e)=>{
    const{name,value}=e.target
    setData({
      ...data,
      [name]:value
    })
   }

    const handleClick= async (e)=>{
    e.preventDefault()
    try {
      const response=await API.post('login',data)
      if(response.status === 200){
        localStorage.setItem('token',response.data.token)
        navigate('/')
      }
      else{
        alert("Login failed")
      }
    } catch (error) {
      alert(error?.response?.data?.message)
    }
    
  }
   
   
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left - Login Form */}
        <div className="w-full lg:w-1/2 p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zM4.5 20.25A7.5 7.5 0 0112 12a7.5 7.5 0 017.5 8.25"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-600 mt-2">Please login to continue</p>
            </div>

            <form onSubmit={handleClick}>
              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    name='email'
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-colors"
                    placeholder="you@example.com"
                    onChange={handleChange}
                  />
                  <div className="absolute right-3 top-3.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    name='password'
                    type="password"
                     autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-colors"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                  <div className="absolute right-3 top-3.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c.552 0 1 .448 1 1v2a1 1 0 11-2 0v-2c0-.552.448-1 1-1zm0-6a4 4 0 00-4 4v2h8V9a4 4 0 00-4-4zm6 6H6v7a2 2 0 002 2h8a2 2 0 002-2v-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className=" cursor-pointer w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-600 focus:ring-opacity-50 transition-colors"
              >
                Login In
              </button>
            </form>
          </div>
        </div>

        {/* Right - Logo Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-10">
          <img src={logo} alt="Logo" className="w-64 h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Login;