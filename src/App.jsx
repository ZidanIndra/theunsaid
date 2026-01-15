import { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import LandingPage from "./components/LandingPage.jsx";
import useJournal from "./hooks/useJournal.js";

export default function App() {
  const {
    currentUser,
    createUser,
    loginUser,
    setActiveUser,
    logout,
    addEntry,
    publishEntry,
    publicEntries
  } = useJournal();
  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [keyCardUser, setKeyCardUser] = useState(null);

  const handleRegister = (nickname) => {
    const result = createUser(nickname);
    if (!result.ok) {
      setRegisterError(result.error);
      return;
    }

    setRegisterError("");
    setLoginError("");
    setKeyCardUser(result.user);
  };

  const handleLogin = (nickname, hash) => {
    const result = loginUser(nickname, hash);
    if (!result.ok) {
      setLoginError(result.error);
      return;
    }

    setLoginError("");
    setRegisterError("");
  };

  const handleProceed = () => {
    if (!keyCardUser) return;
    setActiveUser(keyCardUser.id);
    setKeyCardUser(null);
  };

  const handleLogout = () => {
    logout();
  };

  const handleAddEntry = (text) => addEntry(text);
  const handlePublishEntry = (entryId) => publishEntry(entryId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {currentUser ? (
        <Dashboard
          user={currentUser}
          entries={currentUser.entries || []}
          onAddEntry={handleAddEntry}
          onPublishEntry={handlePublishEntry}
          onLogout={handleLogout}
        />
      ) : (
        <LandingPage
          onRegister={handleRegister}
          onLogin={handleLogin}
          registerError={registerError}
          loginError={loginError}
          publicEntries={publicEntries}
          keyCardUser={keyCardUser}
          onProceed={handleProceed}
        />
      )}
    </div>
  );
}
