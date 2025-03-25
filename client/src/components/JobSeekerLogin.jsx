import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const JobSeekerLogin = () => {
    const navigate = useNavigate();
    const [state, setState] = useState('Login');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(false);
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const { setShowJobSeekerLogin, backendUrl, setUserToken, setUserData, loginUser } = useContext(AppContext);

    // Password validation checks (for Sign Up only)
    const passwordRules = {
        length: /.{6,20}/,
        uppercase: /[A-Z]/,
        number: /\d/,
        symbol: /[!@#$%^&*(),.?":{}|<>]/,
    };

    const [validation, setValidation] = useState({
        length: false,
        uppercase: false,
        number: false,
        symbol: false,
    });

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (state === 'Sign Up') {
            setValidation({
                length: passwordRules.length.test(newPassword),
                uppercase: passwordRules.uppercase.test(newPassword),
                number: passwordRules.number.test(newPassword),
                symbol: passwordRules.symbol.test(newPassword),
            });
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (state === 'Sign Up' && !isTextDataSubmitted) {
            return setIsTextDataSubmitted(true);
        }

        if (state === 'Sign Up' && (!validation.length || !validation.uppercase || !validation.number || !validation.symbol)) {
            return toast.error('Please correct the password error before proceeding.');
        }

        try {
            if (state === 'Login') {
                const result = await loginUser(email, password);
                if (result.success) {
                    setShowJobSeekerLogin(false);
                    navigate('/');
                } else {
                    toast.error(result.message);
                }
            } else {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('phone', phone);
                formData.append('password', password);
                formData.append('email', email);
                formData.append('image', image);

                const { data } = await axios.post(backendUrl + '/api/users/register', formData);
                if (data.success) {
                    setUserData(data.user);
                    setUserToken(data.token);
                    localStorage.setItem('userToken', data.token);
                    setShowJobSeekerLogin(false);
                    navigate('/');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return ( 
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500">
                <h1 className="text-center text-2xl text-neutral-700 font-medium">Job Seeker {state}</h1>
                <p className="text-sm">Welcome back! Please sign in to continue.</p>

                {state === 'Sign Up' && isTextDataSubmitted ? (
                    <div className="flex items-center gap-4 my-10">
                        <label htmlFor="image">
                            <img
                                className="w-16 h-16 rounded-full object-cover cursor-pointer"
                                src={image ? URL.createObjectURL(image) : assets.upload_area}
                                alt="Upload Profile"
                            />
                            <input
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                id="image"
                                hidden
                                accept="image/*"
                            />
                        </label>
                        <p>Upload Profile <br />Photo</p>
                    </div>
                ) : (
                    <>
                        {state !== 'Login' && (
                            <>
                                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                                    <img src={assets.person_icon} alt="" />
                                    <input
                                        className="outline-none text-sm w-full"
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                                    <img src={assets.phone_icon} alt="" />
                                    <input
                                        className="outline-none text-sm w-full"
                                        onChange={(e) => setPhone(e.target.value)}
                                        value={phone}
                                        type="tel"
                                        placeholder="Phone Number"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                            <img src={assets.email_icon} alt="" />
                            <input
                                className="outline-none text-sm w-full"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                placeholder="Email"
                                required
                            />
                        </div>

                        {state === 'Sign Up' && (
                            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                                <img src={assets.lock_icon} alt="" />
                                <input
                                    className="outline-none text-sm w-full"
                                    onChange={handlePasswordChange}
                                    value={password}
                                    type="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        )}

                        {state === 'Sign Up' && (
                            <ul className="mt-2">
                                <li className={`text-sm ${validation.length ? 'text-green-600' : 'text-red-600'}`}>
                                    Password must be more than 6 characters long
                                </li>
                                <li className={`text-sm ${validation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                                    Password must have an uppercase letter
                                </li>
                                <li className={`text-sm ${validation.number ? 'text-green-600' : 'text-red-600'}`}>
                                    Password must have a number
                                </li>
                                <li className={`text-sm ${validation.symbol ? 'text-green-600' : 'text-red-600'}`}>
                                    Password must have a symbol
                                </li>
                            </ul>
                        )}
                    </>
                )}

                {state === 'Login' && (
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.lock_icon} alt="" />
                        <input
                            className="outline-none text-sm w-full"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password"
                            required
                        />
                    </div>
                )}

                {state === 'Login' && (
                    <p className="text-sm text-red-600 mt-4 cursor-pointer">Forgot password?</p>
                )}

                <button
                    type="submit"
                    className="bg-red-600 w-full text-white py-2 rounded-full mt-4 cursor-pointer"
                    disabled={state === 'Sign Up' && (!validation.length || !validation.uppercase || !validation.number || !validation.symbol)}
                >
                    {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create an account' : 'Next'}
                </button>

                {state === 'Login' ? (
                    <p className="mt-5 text-center">
                        Don't have an account?{' '}
                        <span
                            className="text-red-600 cursor-pointer"
                            onClick={() => setState('Sign Up')}
                        >
                            Sign Up
                        </span>
                    </p>
                ) : (
                    <p className="mt-5 text-center">
                        Already have an account?{' '}
                        <span
                            className="text-red-600 cursor-pointer"
                            onClick={() => setState('Login')}
                        >
                            Login
                        </span>
                    </p>
                )}

                <img
                    onClick={() => setShowJobSeekerLogin(false)}
                    className="absolute top-5 right-5 cursor-pointer"
                    src={assets.cross_icon}
                    alt=""
                />
            </form>
        </div>
    );
};

export default JobSeekerLogin;