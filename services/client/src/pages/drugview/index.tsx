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
} from "carbon-components-react"
import React, {useContext} from "react"
import {collection, query, getDocs} from "firebase/firestore"
import {AuthContext} from "~/contexts"
import {db} from "~/firebase"

export const Drugview: React.FC = () => {
    const {currentUser} = useContext(AuthContext)
    const [data, setData] = React.useState<DataTableRow<string>[]>([])
    let xar

    React.useEffect(() => {
        ;(async () => {
            if (currentUser) {
                const que = query(collection(db, currentUser.uid))
                const querySnapshot = await getDocs(que)
                const dataArr: DataTableRow<string>[] = []

                let itr = 0

                querySnapshot.forEach((doc) => {
                    xar = doc.data()
                    // console.log(x)

                    const arr = {
                        id: itr.toString(),
                        name: xar.name,
                        medType: xar.medType,
                        time: `${xar.hour}:${xar.min < 9 ? `0${xar.min}` : xar.min}`,
                        dosage: xar.dosage,
                    }

                    dataArr.push(arr)
                    // idArr[i] = i;
                    // nameArr[i] = x.name;
                    // medTypeArr[i] = x.medType;
                    // timeArr[i] = x.hour + ":" + x.min;

                    // let myMap = new Map<string, string>();
                    // myMap.set();

                    // setDatabase(database);
                    itr++
                })
                setData(dataArr)
            }
        })()
    }, [])

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
    ]

    return (
        <Form>
            <div className="container">
                <Tile className="content-container">
                    <h2>Drug Inventory</h2>
                    <DataTable
                        rows={data}
                        headers={headerData}
                        render={({rows, headers, getHeaderProps}) => (
                            <TableContainer title="DataTable">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {headers.map((header) => (
                                                // eslint-disable-next-line react/jsx-key
                                                <TableHeader {...getHeaderProps({header})}>
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
                </Tile>
            </div>
        </Form>
    )
}

export default Drugview

/* <DataTable rows={rowData} headers={headerData}>
  {({ rows, headers, getHeaderProps, getTableProps }) => (
    <TableContainer title="DataTable">
      <Table {...getTableProps()}>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableHeader {...getHeaderProps({ header })}>
                {header.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {row.cells.map((cell) => (
                <TableCell key={cell.id}>{cell.value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )}
</DataTable> */
