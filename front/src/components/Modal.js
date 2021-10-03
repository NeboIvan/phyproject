import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MultipleValueTextInput from "react-multivalue-text-input";
import IconButton from "@mui/material/IconButton";
import "./modal.css";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [nameavl, setNameval] = React.useState("");
  const [usernameavl, setUsernameval] = React.useState("");
  const [textval, setTextval] = React.useState("");
  const [Options, setOptions] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const nameavlChange = (e) => {
    setNameval(e.target.value);
  };
  const usernameavlChange = (e) => {
    setUsernameval(e.target.value);
  };
  const textvalChange = (e) => {
    setTextval(e.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOkClose = () => {
    const recipeUrl = "http://5.188.158.130:8081/newq";
    const postBody = {
        "name":nameavl,
        "username": usernameavl,
        "question": textval,
        "options": Options.join('@#@'),
        "ans": 2
    };
    console.log(postBody);
    const requestMetadata = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    };

    fetch(recipeUrl, requestMetadata)
      .then((res) => res.json())
      .then((recipes) => {
        console.log(recipes);
      });
    setOpen(false);
    window.location.reload();
  };

  return (
    <div>
      <center style={{ margin: 10 }}>
        <Button variant="outlined" onClick={handleClickOpen}>
          Создать Задачу
        </Button>
      </center>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Создание Задачи</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Название"
            type="text"
            fullWidth
            variant="standard"
            helperText="Обязательное поле"
            value={nameavl}
            onChange={nameavlChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Ваше Имя"
            type="text"
            fullWidth
            variant="standard"
            helperText="Обязательное поле"
            value={usernameavl}
            onChange={usernameavlChange}
          />
          <TextField
            id="outlined-multiline-static"
            label="Текст Задачи"
            multiline
            fullWidth
            rows={4}
            value={textval}
            onChange={textvalChange}
          />
          <MultipleValueTextInput
            onItemAdded={(item, allItems) => setOptions(allItems)}
            onItemDeleted={(item, allItems) => setOptions(allItems)}
            label="Варианты ответа"
            name="item-input"
            placeholder="Введите вариант ответа и нажмите ENTER"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleOkClose}>Ок</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
