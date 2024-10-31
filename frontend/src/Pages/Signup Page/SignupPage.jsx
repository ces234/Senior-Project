import React, { useState } from 'react';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [householdOption, setHouseholdOption] = useState('new'); // Default to starting a new household
    const [joinCode, setJoinCode] = useState(''); // State to store join code
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [displayJoinCode, setDisplayJoinCode] = useState(false); // To toggle join code field visibility

    const handleSubmit = async (e) => {
        e.preventDefault();

        const signupData = {
            username,
            password,
            householdOption,
            joinCode: householdOption === 'existing' ? joinCode : null, // Send join code only if householdOption is "existing"
        };

        try {
            const response = await fetch('http://localhost:8000/user/signup/', {
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

    const handleHouseholdOptionChange = (option) => {
        setHouseholdOption(option);
        setDisplayJoinCode(option === 'existing'); // Show join code input only for "existing" household option
        if (option === 'new') {
            setJoinCode(''); // Clear join code if "new" is selected
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
                                onChange={() => handleHouseholdOptionChange('new')}
                            />
                            Start a new household
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="existing"
                                checked={householdOption === 'existing'}
                                onChange={() => handleHouseholdOptionChange('existing')}
                            />
                            Join an existing household
                        </label>
                    </div>
                </div>
                
                {displayJoinCode && (
                    <div>
                        <label>Join Code:</label>
                        <input
                            type="text"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            placeholder="Enter join code"
                            required
                        />
                    </div>
                )}

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
