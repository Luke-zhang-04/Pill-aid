import "~/index.scss"
import {Form, Tile} from "carbon-components-react"
import React, {useContext} from "react"
import {collection, query, getDocs} from "firebase/firestore"
import {AuthContext} from "~/contexts"
import {db} from "~/firebase"

export const Drugview: React.FC = () => {
    const {currentUser} = useContext(AuthContext)

    React.useEffect(() => {
        ;(async () => {
            if (currentUser) {
                const que = query(collection(db, currentUser.uid))
                const querySnapshot = await getDocs(que)

                querySnapshot.forEach((doc) => {
                    console.log(doc.data())
                })
            }
        })()
    }, [])

    return (
        <Form>
            <div className="container">
                <Tile className="content-container">
                    <h2>Drug Inventory</h2>
                </Tile>
            </div>
        </Form>
    )
}

export default Drugview
