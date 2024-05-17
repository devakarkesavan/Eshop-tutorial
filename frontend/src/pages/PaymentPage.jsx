import React from 'react'
import CheckoutSteps from '../components/Checkout/CheckoutSteps'
import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header'
import Payment from "../components/Payment/Payment";
console.log('hii'+localStorage.getItem('latestOrder'))
const click = () =>{
  
}
const PaymentPage = () => {
  return (
    <div className='w-full min-h-screen bg-[#f6f9fc]'>
       <Header />
       <br />
       <br />
       <CheckoutSteps active={2} /> 
       <button>Pay Now</button>
       <br />
       <br />
       <Footer />
    </div>
  )
}

export default PaymentPage