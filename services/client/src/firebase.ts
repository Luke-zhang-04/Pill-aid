import {initializeApp} from "firebase/app"
import {GoogleAuthProvider, getAuth} from "firebase/auth"

import {getFirestore, collection, getDocs} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBi655f9iEAvVz7MIcnYOVvJqL6zLnEbrQ",
    authDomain: "pill-aid.firebaseapp.com",
    projectId: "pill-aid",
    storageBucket: "pill-aid.appspot.com",
    messagingSenderId: "933725335363",
    appId: "1:933725335363:web:539e88cf2114be99b449f6",
}

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, "form")

// get collection data
getDocs(colRef)
    .then((snapshot) => {
        const form = []

        snapshot.docs.forEach((doc) => {
            form.push({...doc.data(), id: doc.id})
        })
        console.log(form)
    })
    .catch((err) => {
        console.log(err.message)
    })

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

auth.useDeviceLanguage()

export const googleAuthProvider = new GoogleAuthProvider()

export default auth
