import React, { useState } from 'react';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [householdOption, setHouseholdOption] = useState('new'); // Default to starting a new household
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const signupData = {
            username,
            password,
            householdOption
        };

        try {
            const response = await fetch('http://localhost:8000/user/signup/', { // Corrected the URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('User signed up successfully:', data);
                setSuccess('User signed up successfully!'); // Set success message
                setError(null); // Clear any previous error messages
            } else {
                console.error('Signup failed:', data);
                setError(data.error || 'Signup failed.'); // Set error message from response
                setSuccess(null); // Clear any previous success messages
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setError('An error occurred during signup.'); // Set a general error message
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                    />
                </div>
                <div>
                    <label>Household Option:</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="new"
                                checked={householdOption === 'new'}
                                onChange={() => setHouseholdOption('new')}
                            />
                            Start a new household
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="existing"
                                checked={householdOption === 'existing'}
                                onChange={() => setHouseholdOption('existing')}
                            />
                            Join an existing household
                        </label>
                    </div>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
