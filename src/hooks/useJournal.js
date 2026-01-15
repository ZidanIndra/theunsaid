import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "theunsaid.journals.v1";
const SESSION_KEY = "theunsaid.session.v1";
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

const normalizeNickname = (nickname) => (nickname || "").trim();
const normalizeHash = (hash) =>
  (hash || "").toString().trim().replace(/[^0-9]/g, "").slice(0, 4);

const buildId = (nickname, hash) => `${nickname}#${hash}`;

export default function useJournal() {
  const [journals, setJournals] = useState(() => loadJournals());
  const [currentUserId, setCurrentUserId] = useState(() => loadSession());

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return journals[currentUserId] || null;
  }, [journals, currentUserId]);

  const publicEntries = useMemo(() => {
    const entries = [];
    Object.values(journals).forEach((user) => {
      (user.entries || []).forEach((entry) => {
        if (entry.public) {
          entries.push({
            ...entry,
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

  useEffect(() => {
    saveJournals(journals);
  }, [journals]);

  useEffect(() => {
    saveSession(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId && !journals[currentUserId]) {
      setCurrentUserId(null);
    }
  }, [journals, currentUserId]);

  const createUser = (nickname) => {
    const cleanNickname = normalizeNickname(nickname);
    if (!cleanNickname) {
      return { ok: false, error: "Nickname is required." };
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
      return { ok: false, error: "Unable to generate a unique key. Try again." };
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
      return { ok: false, error: "Enter your nickname and 4-digit hash." };
    }

    const id = buildId(cleanNickname, cleanHash);
    const user = journals[id];

    if (!user) {
      return { ok: false, error: "Journal not found." };
    }

    setCurrentUserId(id);
    return { ok: true, user };
  };

  const setActiveUser = (userId) => {
    if (!userId || !journals[userId]) {
      return { ok: false, error: "Journal not found." };
    }

    setCurrentUserId(userId);
    return { ok: true, user: journals[userId] };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const addEntry = (text) => {
    const cleanText = (text || "").trim();
    if (!cleanText) {
      return { ok: false, error: "Write something before saving." };
    }

    if (!currentUserId || !journals[currentUserId]) {
      return { ok: false, error: "No active journal found." };
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      text: cleanText,
      createdAt: new Date().toISOString(),
      public: false,
      publicAt: null
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

  const publishEntry = (entryId) => {
    if (!currentUserId || !journals[currentUserId]) {
      return { ok: false, error: "No active journal found." };
    }

    const current = journals[currentUserId];
    const existingEntry = (current.entries || []).find(
      (entry) => entry.id === entryId
    );

    if (!existingEntry) {
      return { ok: false, error: "Entry not found." };
    }

    if (existingEntry.public) {
      return { ok: false, error: "Entry is already public." };
    }

    const publishedAt = new Date().toISOString();

    setJournals((prev) => {
      const user = prev[currentUserId];
      if (!user) return prev;

      return {
        ...prev,
        [currentUserId]: {
          ...user,
          entries: (user.entries || []).map((entry) =>
            entry.id === entryId
              ? { ...entry, public: true, publicAt: publishedAt }
              : entry
          )
        }
      };
    });

    return { ok: true };
  };

  return {
    journals,
    currentUser,
    publicEntries,
    createUser,
    loginUser,
    setActiveUser,
    logout,
    addEntry,
    publishEntry
  };
}
