import React, { useState } from 'react';
import InputField from './InputField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/users/login', {
        username: form.username,
        password: form.password,
      });
      const user = res.data.user;
      console.log(res.data.user); 
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      localStorage.setItem('username', form.username || form.name);
      localStorage.setItem('userId', user._id);
      
     
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Username"
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;