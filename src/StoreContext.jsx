import React, { createContext, useContext, useState, useEffect } from 'react';
import { INIT_PROGRAMS, INIT_PROFILE, MKT_SEED, INIT_GROUPS, INIT_NOTES, mkInitEvents, SEED_MSGS } from "./data";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, collection, addDoc, serverTimestamp } from "firebase/firestore";

const StoreContext = createContext();

export function StoreProvider({ children, user }) {
  const [profileData, setProfileData] = useState(INIT_PROFILE);
  const [programsList, setProgramsList] = useState(INIT_PROGRAMS);
  const [mktItems, setMktItems] = useState(MKT_SEED);
  const [groupsList, setGroupsList] = useState(INIT_GROUPS);
  const [notes, setNotes] = useState(INIT_NOTES);
  const [events, setEvents] = useState(() => mkInitEvents());

  // 1. Listen for the user's profile data in Firestore
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Separate out notes and programs from the main profile data
        const { notes: dbNotes, programs: dbPrograms, ...profile } = data;
        setProfileData(profile);
        if (dbNotes) setNotes(dbNotes);
        if (dbPrograms) setProgramsList(dbPrograms);
      } else {
        // 2. If no profile exists (new user), create one with all initial mock data
        const initialProfile = {
          ...INIT_PROFILE,
          personal: {
            ...INIT_PROFILE.personal,
            name: user.displayName || "New User",
            email: user.email || ""
          }
        };
        setDoc(userRef, { ...initialProfile, notes: INIT_NOTES, programs: INIT_PROGRAMS });
        setProfileData(initialProfile);
        setNotes(INIT_NOTES);
        setProgramsList(INIT_PROGRAMS);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 4. Listen for Groups globally
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "groups"), (snap) => {
      if (!snap.empty) {
        setGroupsList(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      } else {
        // Seed initial groups and messages
        INIT_GROUPS.forEach(async (g) => {
          await setDoc(doc(db, "groups", String(g.id)), g);
          if (g.id === 1) {
            SEED_MSGS.forEach(async (m) => {
              await addDoc(collection(db, "groups", String(g.id), "messages"), { ...m, uid: m.isMe ? user.uid : "mock-user", createdAt: serverTimestamp() });
            });
          }
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 5. Listen for Marketplace globally
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "marketplace"), (snap) => {
      if (!snap.empty) {
        setMktItems(snap.docs.map(d => ({ ...d.data(), id: Number(d.id) })));
      } else {
        // Seed initial marketplace items
        MKT_SEED.forEach(async (m) => {
          await setDoc(doc(db, "marketplace", String(m.id)), m);
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 3. Wrapper functions to save changes directly to Firestore, supporting functional state updates
  const updateProfileData = (newDataOrUpdater) => {
    setProfileData((prev) => {
      const updated = typeof newDataOrUpdater === "function" ? newDataOrUpdater(prev) : newDataOrUpdater;
      if (user) setDoc(doc(db, "users", user.uid), updated, { merge: true });
      return updated;
    });
  };

  const updateNotes = (newDataOrUpdater) => {
    setNotes((prev) => {
      const updated = typeof newDataOrUpdater === "function" ? newDataOrUpdater(prev) : newDataOrUpdater;
      if (user) setDoc(doc(db, "users", user.uid), { notes: updated }, { merge: true });
      return updated;
    });
  };

  const updateProgramsList = (newDataOrUpdater) => {
    setProgramsList((prev) => {
      const updated = typeof newDataOrUpdater === "function" ? newDataOrUpdater(prev) : newDataOrUpdater;
      if (user) setDoc(doc(db, "users", user.uid), { programs: updated }, { merge: true });
      return updated;
    });
  };

  return (
    <StoreContext.Provider value={{
      profileData, setProfileData: updateProfileData,
      programsList, setProgramsList: updateProgramsList,
      mktItems, setMktItems,
      groupsList, setGroupsList,
      notes, setNotes: updateNotes,
      events, setEvents
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);