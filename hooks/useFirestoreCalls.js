import {
  collection,
  addDoc,
  getFirestore,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useState } from "react";

export default () => {
  const [userRides, setUserRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const startNewRide = async (ride) => {
    try {
      let db = getFirestore();
      const docRef = await addDoc(collection(db, "rides"), ride);
      updateDocumentID(docRef.id, "rides");
      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onDrowsinessDetected = async (incident, rideId) => {
    try {
      let db = getFirestore();
      const rideRef = doc(db, "rides", rideId);
      await updateDoc(rideRef, {
        incidents: incident,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateDocumentID = async (id, collection) => {
    try {
      let db = getFirestore();
      const docRef = doc(db, collection, id);
      await updateDoc(docRef, {
        id: id,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const endRide = async (id) => {
    try {
      let db = getFirestore();
      const docRef = doc(db, "rides", id);
      await updateDoc(docRef, {
        isActive: false,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchUserRides = async (userId) => {
    setLoading(true);
    setUserRides([]);
    let db = getFirestore();
    const rideQuery = query(
      collection(db, "rides"),
      where("user_id", "==", userId)
    );
    const querySnapshot = await getDocs(rideQuery);
    querySnapshot.forEach((doc) => {
      setUserRides((prev) => [...(prev ?? []), doc.data()]);
    });
    setLoading(false);
  };

  const submitContactMessage = async (message) => {
    try {
      setLoading(true);
      let db = getFirestore();
      const docRef = await addDoc(collection(db, "messages"), message);
      updateDocumentID(docRef.id, "messages");
      setLoading(false);
      return true;
    } catch (e) {
      console.error("Error adding document: ", e);
      return false;
    }
  };

  return {
    userRides,
    startNewRide,
    onDrowsinessDetected,
    updateDocumentID,
    endRide,
    fetchUserRides,
    loading,
    submitContactMessage,
  };
};
