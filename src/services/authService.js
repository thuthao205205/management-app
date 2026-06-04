import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

import {
  doc,
  setDoc, 
  getDoc
} from "firebase/firestore";
import {
  createDefaultCategories
} from "./categoryService";
import { auth, db } from "./firebase";

export const updateUserProfile = async ({
  displayName,
  photoURL
}) => {
  await updateProfile(auth.currentUser, {
    displayName,
    photoURL
  });
};

export const registerUser = async (
  username,
  email,
  password
) => {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      username,
      email
    }
  );

  await createDefaultCategories(
    user.uid
  );

  return {
    username,
    email
  };
};

export const loginUser = async (
  email,
  password
) => {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    uid: docSnap.id,
    ...docSnap.data()};
};