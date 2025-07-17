import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useLogin from '../../hooks/login';
import './Login.css';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const { register, handleSubmit } = useForm();
  const [activated, setActivated] = useState(false);
  const { login, loading, error } = useLogin();

  const navigate = useNavigate();

const onSubmit = async (data) => {
 // try {
    const success = await login(data);
    if (success) {
      navigate('/homepage');
    }
   } 
// catch (error) {
//     if (error.response && error.response.status === 403) {
//       navigate('/verify'); 
//     } else {
//       console.error('Login error:', error);
//     }
//   }
// };

  return (
    <div className= "login-page">
    <div
      className={`ring ${activated ? 'activated' : ''}`}
      onMouseEnter={() => setActivated(true)}
    >
      <i style={{ '--clr': '#a965a9' }}></i>
      <i style={{ '--clr': '#ff0057' }}></i>
      <i style={{ '--clr': '#fffd44' }}></i>
      <form className="login" onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
        <div className="inputBx">
          <input
            type="text"
            placeholder="email"
            {...register('email')}
          />
        </div>
        <div className="inputBx">
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="inputBx">
          <input type="submit" value={loading ? 'Loading...' : 'Sign in'} disabled={loading} />
        </div>
        <div className="links">
          <a href="#">Forget Password</a>
          <a href="/signup">Signup</a>
        </div>
      </form>
    </div>
    </div>
  );
}
