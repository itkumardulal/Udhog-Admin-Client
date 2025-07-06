import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers:{
    "Content-Type":"application/json",
    "Accept":"application/json"
  }
})

const apiAuthenticated = axios.create({
  baseURL:import.meta.env.VITE_URL,
  headers:{
    "Content-Type":"application/json",
    "Accept":"application/json",
    'Authorization':localStorage.getItem("token")
  }
})

export  {apiAuthenticated, API};