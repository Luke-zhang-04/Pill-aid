import "./index.scss"
import {Button, ButtonSet, TextInput, Tile} from "carbon-components-react"

export interface Props {
    mode: "login" | "register"
}

export const Auth: React.FC<Props> = ({mode}) => (
    <div className="auth-container">
        <Tile className="auth-form-container">
            <h2>{mode === "login" ? "Login" : "Register"}</h2>
            <TextInput id="username" labelText="Email" />
            <TextInput id="password" labelText="Password" type="password" />
            <ButtonSet>
                <Button kind="ghost">Log in with Google</Button>
                <Button>Log In</Button>
            </ButtonSet>
        </Tile>
    </div>
)

export default Auth
