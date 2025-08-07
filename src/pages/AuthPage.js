import React, { useState } from 'react';
import LoginForm from '../components/Login';
import SignupForm from '../components/SignupForm';

function AuthPage() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      {!showSignup ? (
        <>
          <h2>Login</h2>
          <LoginForm />
          <p style={{ marginTop: '1rem' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Sign up
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>Sign Up</h2>
          <SignupForm />
          <p style={{ marginTop: '1rem' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setShowSignup(false)}
              style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Log in
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default AuthPage;