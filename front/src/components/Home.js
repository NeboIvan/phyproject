import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "./Modal";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("http://localhost:8080/q")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (items.length === 0) {
    return (
      <div>
        <Modal />
        <hr />
        <h2>Nothing To Show</h2>
      </div>
    );
  } else {
    return (
      <div>
        <Modal /><hr/>
        {TableFuncMy(items)}
      </div>
    );
  }
}

function TableFuncMy(rows) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell align="right">Пользователь</TableCell>
            <TableCell align="right">Дата</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <a href={"/qests/" + row.id}>{row.name}</a>
              </TableCell>
              <TableCell align="right">{row.username}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
