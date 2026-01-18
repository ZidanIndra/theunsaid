import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "theunsaid.journals.v1";
const SESSION_KEY = "theunsaid.session.v1";
const BANNED_KEY = "theunsaid.banned.v1";
const isBrowser = typeof window !== "undefined";

const loadJournals = () => {
  if (!isBrowser) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
};

const loadSession = () => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch (error) {
    return null;
  }
};

const saveJournals = (journals) => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
};

const saveSession = (userId) => {
  if (!isBrowser) return;
  if (userId) {
    localStorage.setItem(SESSION_KEY, userId);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

const loadBannedWords = () => {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(BANNED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveBannedWords = (words) => {
  if (!isBrowser) return;
  localStorage.setItem(BANNED_KEY, JSON.stringify(words));
};

const normalizeNickname = (nickname) => (nickname || "").trim();
const normalizeHash = (hash) =>
  (hash || "").toString().trim().replace(/[^0-9]/g, "").slice(0, 4);

const buildId = (nickname, hash) => `${nickname}#${hash}`;

export default function useJournal() {
  const [journals, setJournals] = useState(() => loadJournals());
  const [currentUserId, setCurrentUserId] = useState(() => loadSession());
  const [bannedWords, setBannedWords] = useState(() => loadBannedWords());

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return journals[currentUserId] || null;
  }, [journals, currentUserId]);

  const publicEntries = useMemo(() => {
    const entries = [];
    Object.values(journals).forEach((user) => {
      (user.entries || []).forEach((entry) => {
        const isPublic = entry.isPublic ?? entry.public;
        if (isPublic) {
          entries.push({
            ...entry,
            isPublic: true,
            author: user.nickname,
            authorId: user.id
          });
        }
      });
    });

    return entries.sort(
      (a, b) =>
        new Date(b.publicAt || b.createdAt) -
        new Date(a.publicAt || a.createdAt)
    );
  }, [journals]);

  const allEntries = useMemo(() => {
    const entries = [];
    Object.values(journals).forEach((user) => {
      (user.entries || []).forEach((entry) => {
        entries.push({
          ...entry,
          author: user.nickname,
          authorId: user.id
        });
      });
    });
    return entries.sort(
      (a, b) =>
        new Date(b.createdAt || b.publicAt) -
        new Date(a.createdAt || a.publicAt)
    );
  }, [journals]);

  const normalizedBannedWords = useMemo(() => {
    return bannedWords
      .map((word) => (word || "").trim().toLowerCase())
      .filter(Boolean);
  }, [bannedWords]);

  useEffect(() => {
    saveJournals(journals);
  }, [journals]);

  useEffect(() => {
    saveSession(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    saveBannedWords(bannedWords);
  }, [bannedWords]);

  useEffect(() => {
    if (currentUserId && !journals[currentUserId]) {
      setCurrentUserId(null);
    }
  }, [journals, currentUserId]);

  const createUser = (nickname) => {
    const cleanNickname = normalizeNickname(nickname);
    if (!cleanNickname) {
      return { ok: false, error: "error_nickname_required" };
    }

    let hash = "";
    let id = "";
    let attempts = 0;

    do {
      hash = String(Math.floor(1000 + Math.random() * 9000));
      id = buildId(cleanNickname, hash);
      attempts += 1;
    } while (journals[id] && attempts < 8);

    if (journals[id]) {
      return { ok: false, error: "error_key_generation" };
    }

    const createdAt = new Date().toISOString();
    const user = {
      id,
      nickname: cleanNickname,
      hash,
      createdAt,
      entries: []
    };

    setJournals((prev) => ({
      ...prev,
      [id]: user
    }));

    return { ok: true, user };
  };

  const loginUser = (nickname, hash) => {
    const cleanNickname = normalizeNickname(nickname);
    const cleanHash = normalizeHash(hash);

    if (!cleanNickname || cleanHash.length !== 4) {
      return { ok: false, error: "error_login_required" };
    }

    const id = buildId(cleanNickname, cleanHash);
    const user = journals[id];

    if (!user) {
      return { ok: false, error: "error_journal_not_found" };
    }

    setCurrentUserId(id);
    return { ok: true, user };
  };

  const setActiveUser = (userId) => {
    if (!userId || !journals[userId]) {
      return { ok: false, error: "error_journal_not_found" };
    }

    setCurrentUserId(userId);
    return { ok: true, user: journals[userId] };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const addEntry = (text, isPublic = false) => {
    const cleanText = (text || "").trim();
    if (!cleanText) {
      return { ok: false, error: "error_note_required" };
    }

    if (!currentUserId || !journals[currentUserId]) {
      return { ok: false, error: "error_no_active_journal" };
    }

    if (normalizedBannedWords.length) {
      const lowerText = cleanText.toLowerCase();
      const hasRestricted = normalizedBannedWords.some(
        (word) => word && lowerText.includes(word)
      );
      if (hasRestricted) {
        return { ok: false, error: "error_restricted_words" };
      }
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      text: cleanText,
      createdAt: new Date().toISOString(),
      isPublic: Boolean(isPublic),
      publicAt: isPublic ? new Date().toISOString() : null
    };

    setJournals((prev) => {
      const current = prev[currentUserId];
      if (!current) return prev;

      return {
        ...prev,
        [currentUserId]: {
          ...current,
          entries: [entry, ...(current.entries || [])]
        }
      };
    });

    return { ok: true, entry };
  };

  const updateEntryVisibility = (entryId, isPublic) => {
    if (!currentUserId || !journals[currentUserId]) {
      return { ok: false, error: "error_no_active_journal" };
    }

    const current = journals[currentUserId];
    const target = (current.entries || []).find((entry) => entry.id === entryId);
    if (!target) {
      return { ok: false, error: "error_entry_not_found" };
    }

    const nextPublicAt = isPublic
      ? target.publicAt || new Date().toISOString()
      : null;

    setJournals((prev) => {
      const user = prev[currentUserId];
      if (!user) return prev;

      return {
        ...prev,
        [currentUserId]: {
          ...user,
          entries: (user.entries || []).map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  isPublic: Boolean(isPublic),
                  publicAt: nextPublicAt
                }
              : entry
          )
        }
      };
    });

    return { ok: true };
  };

  const publishAllEntries = () => {
    if (!currentUserId || !journals[currentUserId]) {
      return { ok: false, error: "error_no_active_journal" };
    }

    const now = new Date().toISOString();
    setJournals((prev) => {
      const user = prev[currentUserId];
      if (!user) return prev;

      return {
        ...prev,
        [currentUserId]: {
          ...user,
          entries: (user.entries || []).map((entry) => ({
            ...entry,
            isPublic: true,
            publicAt: entry.publicAt || now
          }))
        }
      };
    });

    return { ok: true };
  };

  const addBannedWord = (word) => {
    const cleanWord = (word || "").trim().toLowerCase();
    if (!cleanWord) {
      return { ok: false, error: "error_banned_word_required" };
    }
    if (normalizedBannedWords.includes(cleanWord)) {
      return { ok: false, error: "error_banned_word_exists" };
    }
    setBannedWords((prev) => [...prev, cleanWord]);
    return { ok: true };
  };

  const removeBannedWord = (word) => {
    const cleanWord = (word || "").trim().toLowerCase();
    setBannedWords((prev) =>
      prev.filter((item) => item.toLowerCase() !== cleanWord)
    );
  };

  const deleteEntry = (entryId) => {
    const exists = Object.values(journals).some((user) =>
      (user.entries || []).some((entry) => entry.id === entryId)
    );
    if (!exists) {
      return { ok: false, error: "error_entry_not_found" };
    }

    setJournals((prev) => {
      const next = {};
      Object.entries(prev).forEach(([userId, user]) => {
        const entries = user.entries || [];
        const filtered = entries.filter((entry) => entry.id !== entryId);
        next[userId] =
          filtered.length !== entries.length
            ? { ...user, entries: filtered }
            : user;
      });
      return next;
    });

    return { ok: true };
  };

  return {
    journals,
    currentUser,
    publicEntries,
    allEntries,
    bannedWords,
    createUser,
    loginUser,
    setActiveUser,
    logout,
    addEntry,
    updateEntryVisibility,
    publishAllEntries,
    addBannedWord,
    removeBannedWord,
    deleteEntry
  };
}
