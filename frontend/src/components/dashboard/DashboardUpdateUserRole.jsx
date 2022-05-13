import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import './dashboardUpdateUserRole.scss'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const DashboardUpdateUserRole = () => {
  const history = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState([])
  const [address, setAddress] = useState([])
  const [avt, setAvt] = useState([])
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`/api/v1/admin/user/${id}`)
        if (data.success) {
          setUser(data.user)
          setAddress(data.user.address)
          setAvt(data.user.avatar.url)
          setEmail(data.user.email)
        }
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
    getUser()
  }, [])

  const handleUpdateRole = async () => {
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }
    try {
      if (role !== '') {
        const { data } = await axios.put(`/api/v1/admin/user/${id}`, { email, role }, config)
        if (data.success) {
          toast.success("Thay đổi vai trò thành công!")
          history('/dashboard/users')
        }
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`)
    }
  }
  return (
    <>
      <div className="col l-7">
        <div>
          <div className="wrap--user__info">
            <div className="user--info">
              <div className="img--user">
                <img src={avt} alt="anh dai dien" />
              </div>
              <div className="user--info__para">
                <h3>{user.name}</h3>
                <h4>Email: {user.email}</h4>
                <h4>Số điện thoại: {user.phone ? user.phone : "Chưa có số điện thoại"}</h4>
              </div>
              <div className="user--info__more">
                <h4>Địa chỉ: {address.length > 0 ? address[0] : "Chưa có địa chỉ"}</h4>
                <h4>Role: {user.role}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col l-2 select-status">
        <h1>Cập nhật trạng thái</h1>
        <select name="update" id="" onChange={(e) => { setRole(e.target.value) }}>
          <option value="">Chọn chức vụ</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button className='btn' onClick={handleUpdateRole}>Cập nhật</button>
      </div>
    </>
  )
}

export default DashboardUpdateUserRole