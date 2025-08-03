import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';

// Get all employees
export const getAllEmployees = async () => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where('role', '==', 'employee'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting employees:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};