import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../utils/axiosConfig';

function LoginPage({ setAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await client.post(
            `${process.env.REACT_APP_BASE_URL}/api/authentification/`,
            {
                email: email,
                password: password,
            }
            );
            setAuth(response.data?.authenticated);
            if (response.data?.authenticated === true) {
                setError('')
                navigate('/en/admin');
            } else {
                setError('Unauthorized')
            }
        } catch (error) {
            setError(error.message)
        } 
    };

  return (
    <div className="mt-20 mx-6 flex flex-1 items-center justify-center">
        <div className='flex flex-col'>
            <h1 className="text-2xl font-bold mb-4">Admin</h1>
            {error && <p className="text-red-500">{error}</p>}
            <input
                className="w-full p-2 border border-gray-300 rounded mb-4"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="w-full p-2 border border-gray-300 rounded mb-4"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button 
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                onClick={handleLogin}
            >
                Login
            </button>
        </div>
    </div>

  );
}

export default LoginPage;
