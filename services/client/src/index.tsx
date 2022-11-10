import "./index.scss"
import "./vendor.scss"
import React from "react"
import ReactDOM from "react-dom/client"
import {Button} from "carbon-components-react"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
    <React.StrictMode>
        <div>Hello world!</div>
        <Button>Button</Button>
    </React.StrictMode>,
)
