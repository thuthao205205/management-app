import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const BUDGET_COLLECTION = "budgets";


   //Thêm ngân sách
export const addBudget = async ({
  uid,
  categoryId,
  month,
  year,
  amount,
}) => {
  const docRef = await addDoc(
    collection(db, BUDGET_COLLECTION),
    {
      uid,
      categoryId,
      month,
      year,
      amount,
      createdAt: Date.now(),
    }
  );

  return {
    id: docRef.id,
    uid,
    categoryId,
    month,
    year,
    amount,
  };
};


   //Lấy toàn bộ ngân sách

export const getBudgets = async (uid) => {
  const q = query(
    collection(db, BUDGET_COLLECTION),
    where("uid", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};


   //Lấy ngân sách theo tháng/năm

export const getBudgetsByMonth = async (
  uid,
  month,
  year
) => {
  const q = query(
    collection(db, BUDGET_COLLECTION),
    where("uid", "==", uid),
    where("month", "==", month),
    where("year", "==", year)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};


   //Cập nhật ngân sách

export const updateBudget = async (
  id,
  data
) => {
  await updateDoc(
    doc(
      db,
      BUDGET_COLLECTION,
      id
    ),
    data
  );
};


   //Xóa ngân sách
export const deleteBudget = async (
  id
) => {
  await deleteDoc(
    doc(
      db,
      BUDGET_COLLECTION,
      id
    )
  );
};


   //Kiểm tra đã có ngân sách cho danh mục/tháng/năm chưa
   
export const hasBudget = async (
  uid,
  categoryId,
  month,
  year
) => {
  const q = query(
    collection(db, BUDGET_COLLECTION),
    where("uid", "==", uid),
    where(
      "categoryId",
      "==",
      categoryId
    ),
    where("month", "==", month),
    where("year", "==", year)
  );

  const snapshot = await getDocs(q);

  return !snapshot.empty;
};

export const getBudgetByCategory = async (
  uid,
  categoryId,
  month,
  year
) => {
  const q = query(
    collection(db, BUDGET_COLLECTION),
    where("uid", "==", uid),
    where("categoryId", "==", categoryId),
    where("month", "==", month),
    where("year", "==", year)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
};