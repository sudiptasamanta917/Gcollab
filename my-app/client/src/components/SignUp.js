import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css'

export const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Updated to useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/signup', { username, email, password });
          console.log('Signup successful:', response.data);
          navigate('/');
          // Handle successful signup (e.g., redirect, show success message)
        } catch (error) {
          console.error('Signup failed:', error.response.data);
        }
    };

    const handleLoginAccount = () => {
        navigate('/'); // Updated to use navigate
      };

    return (
        <div>
            <div className='container'>
                <div className='header'>
                    <div className='text'>Sign Up</div>
                    <div className='underline'></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='inputs'>
                        <div className='input'>
                            <img src="/user.png" alt=""/>
                            <input type='text' 
                                placeholder='User Name' 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div className='input'>
                            <img src="/mail.png" alt=""/>
                            <input type='email' 
                                placeholder='Email Id' 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className='input'>
                            <img src="/5832.jpg" alt=""/>
                            <input type='password' 
                                placeholder='Password' 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='submit-container'>
                        <button type='submit' className='submit'>Sign Up</button>
                        <button type="button" className="submit" onClick={handleLoginAccount}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
