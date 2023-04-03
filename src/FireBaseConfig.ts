import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref as fireStorageRef, uploadBytesResumable } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzaz9cRD_bv2RBst9p1eULkL0m5-ajh2g",
  authDomain: "ecommerce-web-61be0.firebaseapp.com",
  projectId: "ecommerce-web-61be0",
  storageBucket: "ecommerce-web-61be0.appspot.com",
  messagingSenderId: "1041953876722",
  appId: "1:1041953876722:web:2294e7e43c8de243387e6b",
  measurementId: "G-BPXCD700L7",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const analytics = getAnalytics(app);

const upload = (file: any, path: string, getUrl?: (url: string) => any) => {
  const storageRef = fireStorageRef(storage, path + Date.now() + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          // console.log("Upload is paused");
          break;
        case "running":
          // console.log("Upload is running");
          break;
      }
    },
    (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;
        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        getUrl && getUrl(downloadURL);
      });
    }
  );
};

export { upload };
