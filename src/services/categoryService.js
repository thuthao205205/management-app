import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

import { db } from "./firebase";

const defaultCategories = [
  {
    name: "Ăn uống",
    icon: "🍜",
    type: "expense"
  },
  {
    name: "Di chuyển",
    icon: "🚗",
    type: "expense"
  },
  {
    name: "Nhà ở",
    icon: "🏠",
    type: "expense"
  },
  {
    name: "Mua sắm",
    icon: "🛍️",
    type: "expense"
  },
  {
    name: "Y tế",
    icon: "🏥",
    type: "expense"
  },
  {
    name: "Giải trí",
    icon: "🎮",
    type: "expense"
  },
  {
    name: "Lương",
    icon: "💰",
    type: "income"
  },
  {
    name: "Thưởng",
    icon: "🎁",
    type: "income"
  },
  {
    name: "Đầu tư",
    icon: "📈",
    type: "income"
  }
];

export const createDefaultCategories = async (
  uid
) => {
  const promises =
    defaultCategories.map(
      (category) =>
        addDoc(
          collection(
            db,
            "categories"
          ),
          {
            ...category,
            uid,
            isDefault: true,
            createdAt:
              Date.now()
          }
        )
    );

  await Promise.all(promises);
};
const CATEGORY_COLLECTION = "categories";
export const getCategories = async (uid) => {
  const q = query(
    collection(db, CATEGORY_COLLECTION),
    where("uid", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};
export const addCategory = async ({
  uid,
  name,
  type,
  icon
}) => {
  const docRef = await addDoc(
    collection(db, CATEGORY_COLLECTION),
    {
      uid,
      name,
      type,
      icon,
      isDefault: false,
      createdAt: Date.now()
    }
  );

  return {
    id: docRef.id,
    uid,
    name,
    type,
    icon,
    isDefault: false
  };
};
export const updateCategory = async (
  id,
  data
) => {
  await updateDoc(
    doc(db, CATEGORY_COLLECTION, id),
    data
  );
};
export const deleteCategory = async (
  id
) => {
  await deleteDoc(
    doc(db, CATEGORY_COLLECTION, id)
  );
};
