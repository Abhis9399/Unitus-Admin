import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Forgot = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'Password') {
            setPassword(value);
        } else if (name === 'ConfirmPassword') {
            setConfirmPassword(value);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            router.push('/');
        }
    }, []);

    const sendResetEmail = async () => {
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            let res = await response.json();

            if (res.success) {
                console.log("Password reset instructions have been sent to your email");
            } else {
                console.error("Error:", res.error);
            }
        } catch (error) {
            console.error('Error sending reset email:', error.message);
        }
    };

    const resetPassword = async () => {
        if (Password === ConfirmPassword) {
            let data = {
                email,
                newPassword: Password,
                token: router.query.token
            };
            try {
                let response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                let res = await response.json();

                if (res.success) {
                    console.log("Password changed successfully");
                } else {
                    console.error("Error:", res.error);
                }
            } catch (error) {
                console.error('Error resetting password:', error.message);
            }
        } else {
            console.error("Passwords don't match");
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-center px-6 my-32">
                <div className="w-full xl:w-3/4 lg:w-11/12 flex">
                    <div
                        className="w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
                        style={{ backgroundImage: "url('https://source.unsplash.com/oWTW-jNGl9I/600x800')" }}
                    ></div>

                    <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
                        <div className="px-8 mb-4 text-center">
                            <h3 className="pt-4 mb-2 text-2xl">Forgot Your Password?</h3>
                            <p className="mb-4 text-sm text-gray-700">
                                We get it, stuff happens. Just enter your email address below and we'll send you a
                                link to reset your password!
                            </p>
                        </div>
                        {router.query.token ? (
                            <div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="Password">
                                        New Password
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="Password"
                                        name='Password'
                                        type="password"
                                        value={Password}
                                        placeholder="************"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="ConfirmPassword">
                                        Confirm New Password
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="ConfirmPassword"
                                        name='ConfirmPassword'
                                        type="password"
                                        value={ConfirmPassword}
                                        placeholder="************"
                                    />
                                </div>
                                <div className="mb-6 text-center">
                                    <button
                                        onClick={resetPassword}
                                        className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
                                        type="button"
                                    >
                                        Continue
                                    </button>
                                </div>

                                {Password !== ConfirmPassword &&
                                    <span className='text-red-600'>Passwords don't match</span>
                                }
                                {Password && Password === ConfirmPassword &&
                                    <span className='text-green-600'>Passwords match</span>
                                }
                            </div>
                        ) : (
                            <div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="email"
                                        name='email'
                                        type="email"
                                        value={email}
                                        placeholder="Enter Email Address..."
                                    />
                                </div>
                                <div className="mb-6 text-center">
                                    <button
                                        onClick={sendResetEmail}
                                        className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
                                        type="button"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                                <hr className="mb-6 border-t" />
                                <div className="text-center">
                                    <a
                                        className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                                        href='/signup'
                                    >
                                        Create an Account!
                                    </a>
                                </div>
                                <div className="text-center">
                                    <a
                                        className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                                        href='/login'
                                    >
                                        Already have an account? Login!
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forgot;
