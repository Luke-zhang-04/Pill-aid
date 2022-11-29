import {initializeApp} from "firebase/app"
import {GoogleAuthProvider, getAuth} from "firebase/auth"

import {getFirestore, setDoc, doc} from "firebase/firestore"
// import { any } from "zod"

const firebaseConfig = {
    apiKey: "AIzaSyBi655f9iEAvVz7MIcnYOVvJqL6zLnEbrQ",
    authDomain: "pill-aid.firebaseapp.com",
    projectId: "pill-aid",
    storageBucket: "pill-aid.appspot.com",
    messagingSenderId: "933725335363",
    appId: "1:933725335363:web:539e88cf2114be99b449f6",
}

export const toDb = (): any => {
    console.log("FUNCTION CALLED")
    // init services
    const db = getFirestore()

    // const colRef = collection(db, "form")

    // getDocs(colRef)
    //     .then((snapshot) => {
    //         const form = []

    //         snapshot.docs.forEach((doc) => {
    //             form.push({...doc.data(), id: doc.id})
    //         })
    //         console.log(form)
    //     })
    //     .catch((err) => {
    //         console.log(err.message)
    //     })
    setDoc(doc(db, "form/a"), {Description: "LUKE IS MONKEY"}, {merge: true})
        .then(() => {
            console.log("YEP")
        })
        .catch((error: Error) => {
            console.log(error)
        })
}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

auth.useDeviceLanguage()

export const googleAuthProvider = new GoogleAuthProvider()

export default auth
