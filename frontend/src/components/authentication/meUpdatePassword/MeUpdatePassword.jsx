import React, {useState} from 'react'
import axios from 'axios'
import './meUpdatePassword.scss'

const MeUpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }
        await axios.put("/api/v1/password/update", {oldPassword, newPassword, confirmPassword}, config)
        
    }
  return (
    <div className='update-password'>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="">Password</label>
                <input className='update-pass-info' required={true} type="text" value={oldPassword} onChange={(e) => {setOldPassword(e.target.value)}}/>
            </div>
            <div className="form-group">
                <label htmlFor="">New Password</label>
                <input className='update-pass-info' required type="text" value={newPassword} onChange={(e) => {setNewPassword(e.target.value)}}/>
            </div>
            <div className="form-group">
                <label htmlFor="">Confirm Password</label>
                <input className='update-pass-info'  required type="text" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}}/>
            </div>
            <button onClick={handleSubmit}>Update</button>
        </form>
    </div>
  )
}

export default MeUpdatePassword