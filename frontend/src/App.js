import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  if (isLoggedIn) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Home onLogout={() => setIsLoggedIn(false)} />
      </>
    );
  }

  if (page === "signup") {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Signup
          goToLogin={() => setPage("login")}
        />
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Login
        onLogin={() => setIsLoggedIn(true)}
        goToSignup={() => setPage("signup")}
      />
    </>
  );
}

export default App;