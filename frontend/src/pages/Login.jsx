import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from "../components/Login/Login.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const auth = localStorage.getItem('isauth');


  useEffect(() => {
    if(auth === true){
      navigate("/");
    }
  }, [])
  
  return (
    <div>
        <Login />
    </div>
  )
}

export default LoginPage;