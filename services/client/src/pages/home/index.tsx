import {Button} from "carbon-components-react"
import {Link} from "react-router-dom"
import "./index.scss"

export const Home: React.FC = () => (
    <div className="main-container">
        <h1>Welcome to Pill-AID</h1>
        <Button as={Link} to="login">
            Sign In
        </Button>
    </div>
)

export default Home
