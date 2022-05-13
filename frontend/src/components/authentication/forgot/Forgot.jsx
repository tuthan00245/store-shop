import React, { useState } from 'react'
import axios from 'axios'
import './forgot.scss'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../header/Header'

const Forgot = () => {
  const [email, setEmail] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault()
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    }
    const { data } = await axios.post("/api/v1/password/forgot", { email }, config)
    if (data.success) {
      toast.success("Thông báo đã được gửi tới email của bạn!");
    } else {
      toast.error("Email chưa được gửi!");
    }
  }
  return (
    <>
      <Header />
      <div className="forgotpassword-screen">
        <form
          onSubmit={handleSubmit}
          className="forgotpassword-screen__form"
        >
          <h3 className="forgotpassword-screen__title">Quên mật khẩu 🛠</h3>
          <div className="form-group login--improve">
            <p className="forgotpassword-screen__subtext">
              Vui lòng nhập địa chỉ email mà bạn đã đăng kí. Chúng tôi sẽ gửi cách thức lấy mật khẩu trong email của bạn!
            </p>
            <div className="form-group__align">
              <label htmlFor="email">Email:</label>
            </div>
            <input
              type="email"
              required
              id="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-submit">
            <button onClick={handleSubmit} type="submit" className="btn">
              Gửi email
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Forgot