import "~/index.scss"
import {Form, Tile} from "carbon-components-react"
import React from "react"

export const Drugview: React.FC = () => (
    <Form>
        <div className="container">
            <Tile className="content-container">
                <h2>Drug Inventory</h2>
            </Tile>
        </div>
    </Form>
)

export default Drugview
