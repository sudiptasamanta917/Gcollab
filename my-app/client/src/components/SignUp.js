import React from 'react'
import './SignUp.css'

export const SignUp = () => {

  return (
    <div>
        <div className='container'>
            <div className='header'>
                <div className='text'>Sign Up</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <img src="/user.png" alt=""/>
                    <input type='text' placeholder='Name' />
                </div>
                <div className='input'>
                    <img src="/mail.png" alt=""/>
                    <input type='email' placeholder='Email Id' />
                </div>
                <div className='input'>
                    <img src="/5832.jpg" alt=""/>
                    <input type='password' placeholder='Password' />
                </div>
            </div>
            <div className='forgot-password'><span>Forgot password</span></div>
            <div className='submit-container'>
                <div className='submit'>Sign Up</div>
            <div className='submit'>Login</div>
        </div>
        </div>
    </div>
  )
}
