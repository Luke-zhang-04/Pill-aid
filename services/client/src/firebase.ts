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

export const toDatabase = async (username: string, name: string, data: any) => {
    const db = getFirestore()
    const directory = `${username}/${name}`

    await setDoc(doc(db, directory), data, {merge: true})
}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

auth.useDeviceLanguage()

export const googleAuthProvider = new GoogleAuthProvider()

export default auth
