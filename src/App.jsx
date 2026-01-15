import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BrowsePage from "./components/BrowsePage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LandingPage from "./components/LandingPage.jsx";
import NavBar from "./components/NavBar.jsx";
import SubmitPage from "./components/SubmitPage.jsx";
import SupportPage from "./components/SupportPage.jsx";
import UserProfilePage from "./components/UserProfilePage.jsx";
import useJournal from "./hooks/useJournal.js";

export default function App() {
  const {
    currentUser,
    createUser,
    loginUser,
    setActiveUser,
    logout,
    addEntry,
    updateEntryVisibility,
    publishAllEntries,
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

  const handleAddEntry = (text, isPublic) => addEntry(text, isPublic);
  const handleUpdateEntryVisibility = (entryId, isPublic) =>
    updateEntryVisibility(entryId, isPublic);
  const handlePublishAllEntries = () => publishAllEntries();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage publicEntries={publicEntries} />} />
          <Route
            path="/submit"
            element={
              currentUser ? (
                <Dashboard
                  user={currentUser}
                  entries={currentUser.entries || []}
                  onAddEntry={handleAddEntry}
                  onUpdateEntryVisibility={handleUpdateEntryVisibility}
                  onPublishAll={handlePublishAllEntries}
                  onLogout={handleLogout}
                />
              ) : (
                <SubmitPage
                  onRegister={handleRegister}
                  onLogin={handleLogin}
                  registerError={registerError}
                  loginError={loginError}
                  keyCardUser={keyCardUser}
                  onProceed={handleProceed}
                />
              )
            }
          />
          <Route
            path="/browse"
            element={<BrowsePage publicEntries={publicEntries} />}
          />
          <Route
            path="/user/:nickname"
            element={<UserProfilePage publicEntries={publicEntries} />}
          />
          <Route path="/support" element={<SupportPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
