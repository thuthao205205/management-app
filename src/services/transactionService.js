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

const TRANSACTION_COLLECTION =
  "transactions";
//Thêm giao dịch
export const addTransaction =
  async ({
    uid,
    type,
    name,
    categoryId,
    amount,
    note,
    transactionDate
  }) => {

    const docRef =
      await addDoc(
        collection(
          db,
          TRANSACTION_COLLECTION
        ),
        {
          uid,
          type,
          name,
          categoryId,
          amount,
          note,
          transactionDate,
          createdAt: Date.now()
        }
      );

    return {
      id: docRef.id,
      uid,
      type,
      name,
      categoryId,
      amount,
      note,
      transactionDate
    };
  };
//Lấy toàn bộ giao dịch
export const getTransactions =
  async (uid) => {

    const q = query(
      collection(
        db,
        TRANSACTION_COLLECTION
      ),
      where("uid", "==", uid)
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data()
      })
    );
  };
//Lấy Expense
export const getExpenseTransactions =
  async (uid) => {

    const q = query(
      collection(
        db,
        TRANSACTION_COLLECTION
      ),
      where("uid", "==", uid),
      where("type", "==", "expense")
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data()
      })
    );
  };

//Income
export const getIncomeTransactions =
  async (uid) => {

    const q = query(
      collection(
        db,
        TRANSACTION_COLLECTION
      ),
      where("uid", "==", uid),
      where("type", "==", "income")
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data()
      })
    );
  };
//Update
export const updateTransaction =
  async (
    id,
    data
  ) => {

    await updateDoc(
      doc(
        db,
        TRANSACTION_COLLECTION,
        id
      ),
      data
    );
  };
//Xóa
export const deleteTransaction =
  async (id) => {

    await deleteDoc(
      doc(
        db,
        TRANSACTION_COLLECTION,
        id
      )
    );
  };
//ktra danh mục
export const hasTransactionsInCategory =
  async (
    uid,
    categoryId
  ) => {

    const q = query(
      collection(
        db,
        TRANSACTION_COLLECTION
      ),
      where("uid", "==", uid),
      where(
        "categoryId",
        "==",
        categoryId
      )
    );

    const snapshot =
      await getDocs(q);

    return !snapshot.empty;
  };
