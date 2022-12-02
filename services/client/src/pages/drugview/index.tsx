import "~/index.scss"
import {
    Form,
    Tile,
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    TableContainer,
    DataTableRow,
    Button,
    TableToolbar,
    TableToolbarSearch,
    DataTableSkeleton,
} from "carbon-components-react"
import React, {useContext} from "react"
import {collection, query, getDocs} from "firebase/firestore"
import {AuthContext} from "~/contexts"
import {db, deleteMedicine} from "~/firebase"
import {Add16, Edit16, Renew16, TrashCan16} from "@carbon/icons-react"
import {Link} from "react-router-dom"

export const Drugview: React.FC = () => {
    const {currentUser} = useContext(AuthContext)
    const [data, setData] = React.useState<DataTableRow<string>[]>()

    const fetchData = async (): Promise<void> => {
        if (currentUser) {
            const querySnapshot = await getDocs(query(collection(db, currentUser.uid)))
            const dataArr: DataTableRow<string>[] = []
            let counter = 0

            querySnapshot.forEach((doc) => {
                const documentData = doc.data()

                const arr = {
                    id: counter.toString(),
                    name: documentData.name,
                    medType: documentData.medType,
                    time: `${documentData.hour}:${
                        documentData.min < 9 ? `0${documentData.min}` : documentData.min
                    }`,
                    dosage: documentData.dosage,
                    actions: (
                        <div className="table-actions">
                            <Button
                                as={Link}
                                to={`/form/${doc.id}`}
                                kind="ghost"
                                iconDescription="Edit"
                                renderIcon={Edit16}
                                hasIconOnly
                            />
                            <Button
                                onClick={async () => {
                                    await deleteMedicine(`${currentUser.uid}/${doc.id}`)
                                    await fetchData()
                                }}
                                kind="danger--ghost"
                                iconDescription="Delete"
                                renderIcon={TrashCan16}
                                hasIconOnly
                            />
                        </div>
                    ),
                }

                dataArr.push(arr)
                counter++
            })
            setData(dataArr)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [currentUser?.uid])

    const headerData = [
        {
            header: "Name",
            key: "name",
        },
        {
            header: "Medicine Type",
            key: "medType",
        },
        {
            header: "Time",
            key: "time",
        },
        {
            header: "Dosage",
            key: "dosage",
        },
        {
            header: "",
            key: "actions",
        },
    ]

    return (
        <Form>
            <div className="container">
                <Tile className="content-container">
                    {data === undefined ? (
                        <DataTableSkeleton showHeader headers={headerData} showToolbar />
                    ) : (
                        <DataTable
                            rows={data}
                            headers={headerData}
                            render={({
                                rows,
                                headers,
                                getHeaderProps,
                                getToolbarProps,
                                onInputChange,
                            }) => (
                                <TableContainer title="Scheduled Medication">
                                    <TableToolbar {...getToolbarProps()}>
                                        <TableToolbarSearch persistent onChange={onInputChange} />
                                        <Button
                                            renderIcon={Renew16}
                                            kind="ghost"
                                            hasIconOnly
                                            iconDescription="Refresh"
                                            onClick={async () => {
                                                setData(undefined)
                                                await fetchData()
                                            }}
                                        />
                                        <Button
                                            as={Link}
                                            to="/form"
                                            renderIcon={Add16}
                                            tooltipPosition="left"
                                            size="small"
                                            kind="primary"
                                        >
                                            Add new
                                        </Button>
                                    </TableToolbar>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {headers.map((header) => (
                                                    // eslint-disable-next-line react/jsx-key
                                                    <TableHeader
                                                        {...getHeaderProps({
                                                            header,
                                                            isSortable: Boolean(header.header),
                                                        })}
                                                    >
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow key={row.id}>
                                                    {row.cells.map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {cell.value}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        />
                    )}
                </Tile>
            </div>
        </Form>
    )
}

export default Drugview
