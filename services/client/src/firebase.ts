import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBi655f9iEAvVz7MIcnYOVvJqL6zLnEbrQ",
    authDomain: "pill-aid.firebaseapp.com",
    projectId: "pill-aid",
    storageBucket: "pill-aid.appspot.com",
    messagingSenderId: "933725335363",
    appId: "1:933725335363:web:539e88cf2114be99b449f6",
}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export default auth
