import React from 'react'
import {Routes, Route} from 'react-router-dom'
import ProductSearch from '../components/productSearch/ProductSearch'
import Login from '../components/authentication/login/Login'
import Logout from '../components/authentication/logout/Logout'
import Home from '../pages/home/Home'
import Register from '../components/authentication/register/Register'
import MeUpdatePassword from '../components/authentication/meUpdatePassword/MeUpdatePassword'
import Forgot from '../components/authentication/forgot/Forgot'
import ResetPassword from '../components/authentication/resetPassword/ResetPassword'
import ProductDetail from '../components/productDetail/ProductDetail'
import MyCard from '../components/myCard/MyCard'
import MyOrder from '../components/order/MyOrder'
import Opps from '../components/opps/Opps'
import ProtectedRoute from '../components/protectedRoute/ProtectedRoute'
const Router = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated")

  return (
    <Routes >
      <Route path='/product/:keywordss' element={<ProductSearch />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/logout' element={<Logout />}/>
      {/* <Route path='/me/update' element={<MeUpdate />}/> */}
      <Route path='/me/updatepassword' element={<MeUpdatePassword />}/>
      <Route path='/me/password/forgot' element={<Forgot />}/>
      <Route path='/me/resetpassword/:token' element={<ResetPassword/>}/>
      <Route path='/product/detail/:id' element={<ProductDetail />}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/mycard' element={<ProtectedRoute isAuthenticated={isAuthenticated}><MyCard /></ProtectedRoute>}/>
      <Route path='/' element={<Home />}/>
      <Route path='/myorder' element={<MyOrder />}/>
      <Route path='*' element={<Opps />}/>
    </Routes>
  )
}

export default Router