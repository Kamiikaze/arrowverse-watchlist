import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
// import {getAnalytics} from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAW2gtsLAXCLjx8UDgRVr9DWmPsrM40SMg",
  authDomain: "arrowverse-watchlist.firebaseapp.com",
  projectId: "arrowverse-watchlist",
  storageBucket: "arrowverse-watchlist.appspot.com",
  messagingSenderId: "700416954937",
  appId: "1:700416954937:web:fe65a5bbeff72a804ff3e8",
  measurementId: "G-M12701G69Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export {auth, app}
