import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { collection, DocumentReference, getFirestore } from 'firebase/firestore'
// import {getAnalytics} from "firebase/analytics";

const firebaseConfig = {
    apiKey: 'AIzaSyAW2gtsLAXCLjx8UDgRVr9DWmPsrM40SMg',
    authDomain: 'arrowverse-watchlist.firebaseapp.com',
    projectId: 'arrowverse-watchlist',
    storageBucket: 'arrowverse-watchlist.appspot.com',
    messagingSenderId: '700416954937',
    appId: '1:700416954937:web:fe65a5bbeff72a804ff3e8',
    measurementId: 'G-M12701G69Z',
}

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const fbAuth = getAuth(fbApp)

// Initialize Cloud Firestore and get a reference to the service
const fbDb = getFirestore(fbApp)

// Collection references
const usersCollection = collection(fbDb, 'users')
const watchlistsCollection = collection(fbDb, 'watchlist')
const showsCollection = collection(fbDb, 'shows')

// Document references
const docRef = {
    user: DocumentReference,
    watchlist: DocumentReference,
    shows: DocumentReference,
}

export {
    fbApp,
    fbAuth,
    fbDb,
    usersCollection,
    watchlistsCollection,
    showsCollection,
    docRef,
}
