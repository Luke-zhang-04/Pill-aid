import "./init"
import "normalize.css"
import "./index.scss"
import "./vendor.scss"
import {Auth, Home, Forms, Drugview} from "./pages"
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import {auth} from "./firebase"
import {AuthContext} from "./contexts"
import React from "react"
import ReactDOM from "react-dom/client"
import ErrorBoundary from "./components/errorBoundary"
import {Helmet} from "react-helmet"
import {MetaTagsWrapper} from "./components/metaTags"
import {onAuthStateChanged, User} from "firebase/auth"
import Navbar from "./components/nav"

const App: React.FC = () => {
    const [user, setUser] = React.useState<User>()

    onAuthStateChanged(auth, (changedUser) => {
        setUser(changedUser ?? undefined)
    })

    return (
        <ErrorBoundary>
            <AuthContext.Provider value={{currentUser: user}}>
                <Helmet title="Pill-AID" />
                <Router>
                    <Navbar />
                    <div>
                        {/* prettier-ignore */}
                        <Routes>
                            <Route path="/" element={<MetaTagsWrapper title="Home"><Home /></MetaTagsWrapper>} />
                            <Route path="/login" element={<MetaTagsWrapper title="Login"><Auth mode="login" /></MetaTagsWrapper>} />
                            <Route path="/register" element={<MetaTagsWrapper title="Register"><Auth mode="register" /></MetaTagsWrapper>} />
                            <Route path="/form/:id" element={<MetaTagsWrapper title="Forms"><Forms /></MetaTagsWrapper>} />
                            <Route path="/form" element={<MetaTagsWrapper title="Forms"><Forms /></MetaTagsWrapper>} />
                            <Route path="/drugview" element={<MetaTagsWrapper title="Drugview"><Drugview /></MetaTagsWrapper>} />
                        </Routes>
                    </div>
                </Router>
            </AuthContext.Provider>
        </ErrorBoundary>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
