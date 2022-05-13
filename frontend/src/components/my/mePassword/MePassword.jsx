import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Loader from '../../loader/Loader'
import { toast } from 'react-toastify'
import './mePassword.scss'
import 'react-toastify/dist/ReactToastify.css';


const MePassword = () => {
  const [isLoading, setIsLoading] = useState(true)
  const history = useNavigate()

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [oldPasswordShow, setOldPasswordShow] = useState(false)
  const [newPasswordShow, setNewPasswordShow] = useState(false)
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (oldPassword !== "" && newPassword !== "" && confirmPassword !== "") {
      const config = {
        header: {
          "Content-Type": "application/json"
        }
      }
      try {
        const { data } = await axios.put("/api/v1/password/update", { oldPassword, newPassword, confirmPassword }, config)
        if (data) {
          toast.success("Chỉnh sửa thông tin thành công")
          history("/me/profile")
        }
      }catch(error) {
        toast.error(`${error.response.data.message}`)
      }
    } else {
      toast.error("Vui lòng nhập đúng, đầy đủ thông tin")
    }
  }

  return (
    <div className="col l-10 m-12 c-12 index__profile index__update">
      {
        isLoading ? <>
          <div className="index__profile--heading">
            <h1 className='index__profile--heading--item'>Thay đổi password</h1>
          </div>
          <div className="wrap__info">
            <div className="row sm-gutter flex-wrap">
              <div className="col l-12 set__height">
                <div className="index__profile--content--item">
                  <h3 className='index__profile--content-heading'>Mật khẩu cũ</h3>
                  <input type={oldPasswordShow ? "text" : "password"} placeholder='Nhập mật khẩu cũ...' value={oldPassword} onChange={(e) => {setOldPassword(e.target.value);}} />
                  <i onClick={() =>  setOldPasswordShow(!oldPasswordShow)} className="fa-solid fa-eye"></i>
                </div>
              </div>
              <div className="col l-12 set__height">
                <div className="index__profile--content--item">
                  <h3 className='index__profile--content-heading'>Mật khẩu mới</h3>
                  <input type={newPasswordShow ? "text" : "password"} placeholder='Nhập mật khẩu mới...' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <i onClick={() =>  setNewPasswordShow(!newPasswordShow)} className="fa-solid fa-eye"></i>
                </div>
              </div>
              <div className="col l-12 set__height">
                <div className="index__profile--content--item">
                  <h3 className='index__profile--content-heading'>Xác nhận mật khẩu mới</h3>
                  <input type={confirmPasswordShow ? "text" : "password"} placeholder='Nhập lại mật khẩu mới...' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <i onClick={() =>  setConfirmPasswordShow(!confirmPasswordShow)} className="fa-solid fa-eye"></i>
                </div>
              </div>
            </div>
            <div className="contain__button">
              <button className='btn primary-btn' onClick={handleSubmit}>THAY ĐỔI PASSWORD</button>
            </div>
          </div>
        </> : <Loader />
      }
    </div>
  )
}

export default MePassword