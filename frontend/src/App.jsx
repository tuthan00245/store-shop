import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import './grid.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Router from './config/Router';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MeUpdate from './components/my/meUpdate/MeUpdate'
import Me from './components/my/me/Me';
import { ToastContainer, toast } from 'react-toastify';
import MeProfile from './components/my/meProfile/MeProfile';
import MePassword from './components/my/mePassword/MePassword';
import MeAddress from './components/my/meAddress/MeAddress';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import DashboardMain from './components/dashboard/DashboardMain.jsx';
import DashboardProducts from './components/dashboard/DashboardProducts';
import DashboardUsers from './components/dashboard/DashboardUsers';
import DashboardOrders from './components/dashboard/DashboardOrders';
import DashboardCreateProduct from './components/dashboard/DashboardCreateProduct';
import DashboardUpdateOrder from './components/dashboard/DashboardUpdateOrder'
import DashboardUpdateProduct from './components/dashboard/DashboardUpdateProduct';
import DashboardUpdateUserRole from './components/dashboard/DashboardUpdateUserRole';

function WrapComponent({ children }) {
  return children
}

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated")
  const [user, setUser] = useState([])

  useEffect(() => {
    let users = [];
    const getUser = async () => {
      if (isAuthenticated) {
        users = await axios.get("/api/v1/me")
        setUser(users.data.user)
      }
    }
    getUser()
  }, [isAuthenticated])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<WrapComponent>
          <ToastContainer className="Toastify" position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
          {/* <Header /> */}
          <Router />
          <Footer />
        </WrapComponent>}>
        </Route>
        <Route path='me' element={<WrapComponent>
          <ToastContainer className="Toastify" position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
          <ProtectedRoute isAuthenticated={isAuthenticated}> <Me /> </ProtectedRoute>
        </WrapComponent>}>
            <Route path='profile' element={<MeProfile />} />
            <Route path='update' element={<MeUpdate />} />
            <Route path='password' element={<MePassword />} />
            <Route path='address' element={<MeAddress />} />
        </Route>
        <Route path='dashboard' element={<WrapComponent>
          <ToastContainer className="Toastify" position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
          <ProtectedRoute adminRoute={true} isAdmin={user.role} isAuthenticated={isAuthenticated} > <Dashboard /> </ProtectedRoute>
          </WrapComponent>}>
          <Route path='main' element={<DashboardMain />}/>
          <Route path='products' element={<DashboardProducts />}/>
          <Route path='users' element={<DashboardUsers />}/>
          <Route path='orders' element={<DashboardOrders />}/>
          <Route path='create/product' element={<DashboardCreateProduct />}/>
          <Route path='update/order/:id' element={<DashboardUpdateOrder />}/>
          <Route path='update/product/:id' element={<DashboardUpdateProduct/>}/>
          <Route path='update/user/:id' element={<DashboardUpdateUserRole/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
