import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../header/Header'

import './login.scss'

const Login = () => {
  localStorage.removeItem("isAuthenticated")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const history = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // const config = {
    //   header: {
    //     "Content-Type": "application/json",
    //   },
    // }
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("isAuthenticated");
    headers.append("Authorization", "Bearer " + t);

    const { data } = await axios.post("/api/v1/login", { email, password }, { headers: headers })
    if (data.success) {
      localStorage.setItem("isAuthenticated", JSON.stringify(data.token))
      console.log(data.token);
      history("/")
      window.location.reload("true")
      toast.success("Đăng nhập thành công!");
    } else {
      toast.error("Đăng ký thất bại!");
    }
    // console.log(data.user)
  }




  return (
    // <div className='login'>
    //   <form className='form-login' onSubmit={(e) => { handleSubmit(e) }}>
    //     <div className="form-group">
    //       <label >Email</label>
    //       <input type="email" placeholder='Email...' value={email} onChange={(e) => { setEmail(e.target.value) }} />
    //     </div>
    //     <div className="form-group">
    //       <label >Password</label>
    //       <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
    //     </div>
    //     <button type='submit' onClick={(e) => {handleSubmit(e)}}>Login</button>
    //   </form>
    // </div>
    <>
      <Header />
      <div className="login-screen">
        <form onSubmit={handleSubmit} className="login-screen__form">
          <h3 className="login-screen__form__title">Đăng nhập 💙</h3>
          <div className="form-group">
            <div className="form-group__align">
              <label htmlFor="email">Email:</label>
            </div>
            <input
              type="email"
              required
              id="email"
              placeholder="Nhập email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              tabIndex={1}
            />
          </div>
          <div className="form-group">
            <div className="form-group-remaining">
              <div className="form-group__align">
                <label htmlFor="password">
                  Mật khẩu:
                </label>
              </div>
              <input
                type="password"
                required
                id="password"
                autoComplete="true"
                placeholder="Nhập mật khẩu..."
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                tabIndex={2}
              />
            </div>
            <Link to="/me/password/forgot" className="login-screen__forgotpassword">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="form-submit">
            <button onClick={handleSubmit} type="submit" className="btn">
              Đăng nhập
            </button>
          </div>

          <span className="login-screen__subtext">
            Chưa có tài khoản? <Link to="/register" target="_self">Đăng kí</Link>
          </span>
        </form>
      </div>
    </>
  )
}

export default Login