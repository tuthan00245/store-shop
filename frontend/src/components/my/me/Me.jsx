import React, { useEffect, useRef, useState } from 'react'
import './me.scss'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import Header from '../../header/Header';

const Me = () => {
  const profileRef = useRef(null)
  const addressRef = useRef(null)

  const [refreshKey, setRefreshKey] = useState(0)
  
  useEffect(() => {
    const handleSetActive = () => {
      const allRef = [profileRef, addressRef]
      allRef.forEach((ref, i) => {
        ref.current.classList.remove('show--active')
      })
      if(window.location.pathname.includes("profile")) {
        addressRef.current.classList.remove('show--active')
        profileRef.current.classList.add('show--active')
      }
      if(window.location.pathname.includes("address")) {
        profileRef.current.classList.remove('show--active')
        addressRef.current.classList.add('show--active')
      }
    }
    handleSetActive()
  }, [refreshKey])

  const handleRefreshKey = () => {
    setRefreshKey(oldv => oldv + 1)
  }
  
  return (
    <div className="app__container fake__height">
      <Header />
      <div className="grid wide">
        <div className="row sm-gutter product__wrap">
          <div className="col l-2 m-0 c-0">
            <span className='say__hi'>Xin chào, Nguyễn Đình Nghĩa</span>
            <div className="control--account">
              <h2 className='control--account__heading'>Quản lý tài khoản</h2>
              <ul className='control--account__list'>
                <li className='control--account__list--item'><Link ref={profileRef} className="show--active" to="profile" onClick={handleRefreshKey}>Thông tin cá nhân</Link></li>
                <li className='control--account__list--item'><Link ref={addressRef} to="address" onClick={handleRefreshKey}>Địa chỉ</Link></li>
              </ul>
            </div>
            <div className="control--account">
              <h2 className='control--account__heading'>Sản phẩm</h2>
              <ul className='control--account__list'>
                {/* <li className='control--account__list--item'><Link to="favourite">Sản phẩm yêu thích</Link></li> */}
                <li className='control--account__list--item'><Link to="/mycard">Giỏ hàng</Link></li>
                <li className='control--account__list--item'><Link to="/myorder">Đơn hàng của tôi</Link></li>
              </ul>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Me