import React, { useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import './resetPassword.scss'

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {token} = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }
        await axios.put(`/api/v1/password/reset/${token}`, {password, confirmPassword}, config);
    }

  return (
    <div className="resetpassword-screen">
      <form
        onSubmit={handleSubmit}
        className="resetpassword-screen__form"
      >
        <h3 className="resetpassword-screen__title">Thay đổi mật khẩu</h3>
        <div className="form-group">
        <div className="form-group__align">
          <label htmlFor="password">Mật khẩu mới:</label></div>
          <input
            type="password"
            required
            id="password"
            placeholder="Nhập mật khẩu mới..."
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
        <div className="form-group__align">

          <label htmlFor="confirmpassword">Xác nhận mật khẩu:</label>
          </div>
          <input
            type="password"
            required
            id="confirmpassword"
            placeholder="Nhập lại mật khẩu..."
            autoComplete="true"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-submit">
        <button onClick={handleSubmit} type="submit" className="btn">
          Cập nhật
        </button>
        </div>
      </form>
    </div>
  )
}

export default ResetPassword