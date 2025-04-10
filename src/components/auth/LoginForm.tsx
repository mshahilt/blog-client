import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {email?: string, password?: string} = {};
    if (!email) newErrors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
  if (!password) newErrors.password = 'Password is required';
  else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
    
  try {
    await login(email, password);
    navigate('/');
  } catch (error) {
    console.error('Login error:', error);
    setErrors({ email: 'Invalid email or password' });
  }
};
  
return (
  <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Log In</h2>
    
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        id="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      
      <Input
        label="Password"
        type="password"
        id="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      
      <div className="mb-6">
        <button
          type="button"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Forgot password?
        </button>
      </div>
      
      <Button type="submit" className="w-full">
        Log In
      </Button>
    </form>
  </div>
);
};