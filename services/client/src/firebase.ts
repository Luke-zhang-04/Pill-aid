import {initializeApp} from "firebase/app"
import {GoogleAuthProvider, getAuth} from "firebase/auth"
import {getFirestore, setDoc, doc} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBi655f9iEAvVz7MIcnYOVvJqL6zLnEbrQ",
    authDomain: "pill-aid.firebaseapp.com",
    projectId: "pill-aid",
    storageBucket: "pill-aid.appspot.com",
    messagingSenderId: "933725335363",
    appId: "1:933725335363:web:539e88cf2114be99b449f6",
}

export const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const toDatabase = async (path: string, data: any) => {
    await setDoc(doc(db, path), data, {merge: true})
}

export const auth = getAuth(app)

auth.useDeviceLanguage()

export const googleAuthProvider = new GoogleAuthProvider()

export default auth
