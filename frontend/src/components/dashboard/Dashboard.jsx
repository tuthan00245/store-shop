import React, { useRef, useState, useEffect } from 'react'
import './dashboard.scss'
import logo from '../../assets/img/cart-logo-main.svg'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {

  const productRef = useRef(null)
  const orderRef = useRef(null)
  const userRef = useRef(null)
  const reviewRef = useRef(null)

  const [user, setUser] = useState([])
  const [avt, setAvt] = useState('')

  const history = useNavigate()
  const logoutRef = useRef()
  //logout
  const handleLogout = async (e) => {
    e.preventDefault();

    const { data } = await axios.get("/api/v1/logout");
    if (data.success) {
      localStorage.removeItem('isAuthenticated')
      history('/login')
      window.location.reload("true")
    }

  }

  //get me info
  useEffect(() => {
    let users = [];
    const getUser = async () => {
      users = await axios.get("/api/v1/me")
      setUser(users.data.user)
      setAvt(users.data.user.avatar.url)
    }
    getUser()
  }, [])

  const handleToggleLogout = (e) => {
    e.preventDefault()
    logoutRef.current.classList.toggle('show')
  }

  const handleToggleList = (ref) => {
    if (ref!==null) {

      ref.current.classList.toggle('show')
    }
  }
  return (
    <div className="row dashboard">
      <div className="dashboard--header">
        <div className="dashboard--logo">
          {/* <img src={logo} alt="" /> */}
          <h1>DASHBOARD</h1>
        </div>
        <div onClick={handleToggleLogout} className="dashboard__avt">
          <img src={avt} alt="" className="header__navbar-user-img" />
          <span className="header__navbar-user-name">{user.name}</span>
          <ul ref={logoutRef} className="dashboard__logout--list">
            <li className="dashboard__logout--list--item"><Link to="/login" onClick={handleLogout}>Đăng xuất <i className="fa-solid fa-right-to-bracket"></i></Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap--dashboard">
        <div className="col l-2 main--board">
          <div className="dashboard__menu">
            <div className="dashboard__menu--item">
              <Link to="/" >
                <i className="fa-solid fa-house-user"></i>
                Trang chủ
              </Link >
            </div>
            <div className="dashboard__menu--item">
              <Link to="/dashboard/main" >
                <i className="fa-solid fa-chart-line"></i>
                Dashboard
              </Link >
            </div>
            <div className="dashboard__menu--item">
              <Link onClick={() => {handleToggleList(productRef)}} to="#" >
                <i className="fa-brands fa-swift"></i>
                Sản phẩm
              </Link >
              <ul ref={productRef} className='dashboard__menu--item-list'>
                <li className='dashboard__menu--item-list-item'><Link to="/dashboard/create/product"><i className="fa-solid fa-plus"></i> Tạo sản phẩm</Link></li>
                <li className='dashboard__menu--item-list-item'><Link to="/dashboard/products"><i className="fa-solid fa-border-all"></i> Quản lý sản phẩm</Link></li>
              </ul>
            </div>
            <div className="dashboard__menu--item">
              <Link onClick={() => {handleToggleList(orderRef)}} to="#" >
                <i className="fa-brands fa-jedi-order"></i>
                Đơn đặt hàng
              </Link >
              <ul ref={orderRef} className='dashboard__menu--item-list'>
                {/* <li className='dashboard__menu--item-list-item'><Link to="/dashboard/update/order"><i className="fa-solid fa-plus"></i> Cập nhật đơn hàng</Link></li> */}
                <li className='dashboard__menu--item-list-item'><Link to="/dashboard/orders"><i className="fa-solid fa-border-all"></i> Quản lý đơn hàng</Link></li>
              </ul>
            </div>
            <div className="dashboard__menu--item">
              <Link onClick={() => {handleToggleList(userRef)}} to="#" ><i className="fa-solid fa-users"></i>
                Người dùng</Link >
                <ul ref={userRef} className='dashboard__menu--item-list'>
                {/* <li className='dashboard__menu--item-list-item'><Link to="/dashboard/create/product"><i className="fa-solid fa-plus"></i> Tạo tài khoản</Link></li> */}
                <li className='dashboard__menu--item-list-item'><Link to="/dashboard/users"><i className="fa-solid fa-border-all"></i> Quản lý tài khoản</Link></li>
              </ul>
            </div>
            {/* <div className="dashboard__menu--item">
              <Link onClick={() => {handleToggleList(reviewRef)}} to="#" ><i className="fa-solid fa-pen-to-square"></i>
                Đánh giá</Link >
                <ul ref={reviewRef} className='dashboard__menu--item-list'>
                <li className='dashboard__menu--item-list-item'><Link to="/dashboard/products"><i className="fa-solid fa-border-all"></i> Tất cả đánh giá</Link></li>
              </ul>
            </div> */}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard