import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import BrowsePage from "./components/BrowsePage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LandingPage from "./components/LandingPage.jsx";
import NavBar from "./components/NavBar.jsx";
import SubmitPage from "./components/SubmitPage.jsx";
import SupportPage from "./components/SupportPage.jsx";
import UserProfilePage from "./components/UserProfilePage.jsx";
import AdminPage from "./components/AdminPage.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
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
    publicEntries,
    allEntries,
    bannedWords,
    addBannedWord,
    removeBannedWord,
    deleteEntry
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

  const pageMotion = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.25 } }
  };

  const PageWrapper = ({ children }) => (
    <motion.div
      variants={pageMotion}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );

  const AppRoutes = () => {
    const location = useLocation();
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <LandingPage publicEntries={publicEntries} />
              </PageWrapper>
            }
          />
          <Route
            path="/submit"
            element={
              <PageWrapper>
                {currentUser ? (
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
                )}
              </PageWrapper>
            }
          />
          <Route
            path="/browse"
            element={
              <PageWrapper>
                <BrowsePage publicEntries={publicEntries} />
              </PageWrapper>
            }
          />
          <Route
            path="/user/:nickname"
            element={
              <PageWrapper>
                <UserProfilePage publicEntries={publicEntries} />
              </PageWrapper>
            }
          />
          <Route
            path="/zidan990"
            element={
              <PageWrapper>
                <AdminPage
                  entries={allEntries}
                  bannedWords={bannedWords}
                  onAddBannedWord={addBannedWord}
                  onRemoveBannedWord={removeBannedWord}
                  onDeleteEntry={deleteEntry}
                />
              </PageWrapper>
            }
          />
          <Route
            path="/support"
            element={
              <PageWrapper>
                <SupportPage />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
    );
  };

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <NavBar />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
