import "./index.scss"
import {Button, ButtonSet, Link, TextInput, Tile} from "carbon-components-react"
import {useNavigate} from "react-router-dom"

export interface Props {
    mode: "login" | "register"
}

export const Auth: React.FC<Props> = ({mode}) => {
    const nav = useNavigate()

    return (
        <div className="auth-container">
            <Tile className="auth-form-container">
                <h2>{mode === "login" ? "Login" : "Register"}</h2>
                {mode === "login" ? (
                    <>
                        <TextInput id="username" labelText="Email" />
                        <TextInput id="password" labelText="Password" type="password" />
                        <Link
                            onClick={() => nav("/register", {replace: true})}
                            className="change-mode-link"
                        >
                            Don&apos;t have an account yet? Create an one!
                        </Link>
                        <ButtonSet className="auth-footer">
                            <Button kind="ghost">Log in with Google</Button>
                            <Button>Log In</Button>
                        </ButtonSet>
                    </>
                ) : (
                    <>
                        <TextInput id="username" labelText="Email" />
                        <TextInput id="password" labelText="Password" type="password" />
                        <TextInput id="password2" labelText="Confirm Password" type="password" />
                        <Link
                            onClick={() => nav("/login", {replace: true})}
                            className="change-mode-link"
                        >
                            Already have an account?
                        </Link>
                        <ButtonSet className="auth-footer">
                            <Button kind="ghost">Register with Google</Button>
                            <Button>Register</Button>
                        </ButtonSet>
                    </>
                )}
            </Tile>
        </div>
    )
}

export default Auth
