import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopLogin from "../components/Shop/ShopLogin";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const {isLoading } = useSelector((state) => state.seller);
  const isSeller = localStorage.getItem('isseller')

  useEffect(() => {
    if(isSeller === true){
      navigate(`/dashboard`);
    }
  }, [isLoading,isSeller])
  return (
    <div>
        <ShopLogin />
    </div>
  )
}

export default ShopLoginPage