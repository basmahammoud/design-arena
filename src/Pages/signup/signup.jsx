import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';
import useRegister from '../../hooks/register'; 

export default function Signup() {
  const { register, handleSubmit, watch } = useForm();
  const [activated, setActivated] = useState(false);
  const { register: registerUser, loading, error } = useRegister();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const passwordsMatch = data.password === data.password_confirmation;
    if (!passwordsMatch) {
      alert('Passwords do not match');
      return;
    }

    const success = await registerUser(data);
    if (success) {
      navigate('/verify');
    }
  };

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
        <h2>Signup</h2>

        <div className="inputBx">
          <input
            type="text"
            placeholder="name"
            {...register('name', { required: true })}
          />
        </div>

        <div className="inputBx">
          <input
            type="text"
            placeholder="email"
            {...register('email', { required: true })}
          />
        </div>

        <div className="inputBx">
          <input
            type="text"
            placeholder="phone"
            {...register('phone', { required: true })}
          />
        </div>

        <div className="inputBx">
        <select {...register('seeking', { required: true })} defaultValue="">
      <option value="" disabled>Select Seeking Option</option>
      <option value="1">Part-time</option>
      <option value="2">Fulltime</option>
      <option value="3">Freelancer</option>
        </select>

        </div>

        <div className="inputBx">
          <input
            type="text"
            placeholder="Experience (Optional)"
            {...register('experience')}
          />
        </div>

        <div className="inputBx">
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
          />
        </div>

        <div className="inputBx">
          <input
            type="password"
            placeholder="Confirm Password"
            {...register('password_confirmation', { required: true })}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="inputBx">
          <input type="submit" value={loading ? 'Signing up...' : 'Sign up'} disabled={loading} />
        </div>

      </form>
    </div>
    </div>
  );
}
