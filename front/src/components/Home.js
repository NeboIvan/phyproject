import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "./Modal";
import LoginButton from "./others/LoginBtn";
import { useAuth0 } from "@auth0/auth0-react";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import LogoutButton from "./others/LogOutBtn";
import {IconButton,Tooltip} from "@mui/material";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function Home(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://" + props.addr + "/q")
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

  const { user,logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
          Loading.... User Data
        </Backdrop>
      </div>
    );
  }
  console.log(user);
  const chenter = {
    margin: 10,
    display: "flex",
    justifyContent: "space-between",
  };
  const mid = {
    margin: 10,
    display: "flex",
    justifyContent: "center",
  };

  const ava = (
    <div>
      <Tooltip title={user?.name + ", Выйти?"} placement="bottom">
        <IconButton onClick={() => logout({ returnTo: window.location.origin })}>
          <Avatar alt={user == 0 ? "NoName" : user?.name} src={user == 0 ? "https://cdn3.iconfinder.com/data/icons/viiva-emotions-vol2/32/huh-512.png" :  user?.picture } />
        </IconButton>
      </Tooltip>
    </div>
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
          Loading.... Data
        </Backdrop>
      </div>
    );
  } else if (items.length === 0) {
    return (
      <div>
        <div style={chenter}>
          {" "}
          <Modal addr={props.addr} /> <div>{ava}</div>
        </div>
        <hr />
        <h2>Nothing To Show</h2>
      </div>
    );
  } else if (!isAuthenticated) {
    return (
      <div>
        <div style={mid}>
          <LoginButton />
        </div>
        <Alert variant="outlined" severity="error">
          Вы должны быть авторизованны
        </Alert>
      </div>
    );
  } else {
    return (
      <div>
        <div style={chenter}>
          {" "}
          <Modal addr={props.addr} /> <div>{ava}</div>
        </div>
        <hr />
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
