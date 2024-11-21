import React, { useState } from 'react';
import './SignupPage.css'; 


const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [householdOption, setHouseholdOption] = useState('new'); // Default to starting a new household
  const [joinCode, setJoinCode] = useState(''); // State to store join code
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [displayJoinCode, setDisplayJoinCode] = useState(false); // To toggle join code field visibility

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signupData = {
      username,
      password,
      householdOption,
      joinCode: householdOption === 'existing' ? joinCode : null,
    };

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/user/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setSuccess('User signed up successfully!');
        setError(null);
      } else {
        setError(data.error || 'Signup failed.');
        setSuccess(null);
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred during signup.');
    }
  };

  const handleHouseholdOptionChange = (option) => {
    setHouseholdOption(option);
    setDisplayJoinCode(option === 'existing');
    if (option === 'new') setJoinCode('');
  };

  return (
    <div className="outerContainer">
      <div className="innerContainer">
        <div className="signupFormContainer">
          <form className="signupForm" onSubmit={handleSubmit}>
            <h1 className="signupTitle">Sign Up</h1>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label className="inputLabel">
              Username:
              <input
                className="textInput"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="inputLabel">
              Password:
              <input
                className="textInput"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <div>
              <label className="inputLabel">Household Option:</label>
              <div className="radioGroup">
                <label className="radioLabel">
                  <input
                    type="radio"
                    value="new"
                    checked={householdOption === 'new'}
                    onChange={() => handleHouseholdOptionChange('new')}
                  />
                  Start a new household
                </label>
                <label className="radioLabel">
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
              <label className="inputLabel">
                Join Code:
                <input
                  className="textInput"
                  type="text"
                  placeholder="Enter join code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                />
              </label>
            )}
            <button className="signupButton" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
