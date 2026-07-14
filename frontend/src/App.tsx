import "./App.css";
import Home from "./pages/Home";
import Chords from "./pages/Chords";
import Songwriting from "./pages/Songwriting";
import AuthModal from "./components/auth/AuthModal";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { isLoggedIn as checkIsLoggedIn, clearToken } from "./api/auth";


/**
 * App (Top level component)
 *
 * Defines all page routes and owns the two pieces of state that need to be accessible from ANY page
 * (whether the auth modal is open, and whether the user is currently logged in)
 *
 * AuthModal is rendered here. It can be triggered from Home's "Login" button, or from Chords/Songwriting
 * Both of those pages receive an onRequireAuth callback that just opens this same modal
 */
function App() {

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialized by checking localStorage on load.
  // Logged in user, from a previous sessions, sees correct state immediately after refresh, 
  // (rather than appearing logged out until some later check runs)
  const [loggedIn, setLoggedIn] = useState(checkIsLoggedIn());

  function handleLoginSuccess() {
    setLoggedIn(true);
    setShowAuthModal(false);
  }

  function handleLogout() {
    clearToken();
    setLoggedIn(false);
  }
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onOpenLogin={() => setShowAuthModal(true)}
              isLoggedIn={loggedIn}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/chords"
          element={<Chords onRequireAuth={() => setShowAuthModal(true)} />}
        />
        <Route
          path="/songwriting"
          element={<Songwriting onRequireAuth={() => setShowAuthModal(true)} />}
        />
      </Routes>

      {showAuthModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowAuthModal(false)} />
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      )}
    </>
  );
}

export default App;
