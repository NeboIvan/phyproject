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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import "./modal.css";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [nameavl, setNameval] = React.useState("");
  const [usernameavl, setUsernameval] = React.useState("");
  const [textval, setTextval] = React.useState("");
  const [Options, setOptions] = React.useState([]);
  const [Answers, setAnswers] = React.useState([]);
  const [error, SetError] = React.useState(false);
  const [error1, SetError1] = React.useState(false);
  const [AlertOpen, SetAlertOpen] = React.useState(false);
  const [error2, SetError2] = React.useState(false);
  const [error3, SetError3] = React.useState(false);
  const [errorText, SetErrorText] = React.useState("Не должно быть пустым");
  const ErrText = "Не должно быть пустым";
  console.log("jjjjj:  "+props.addr);
  const handleToggle = (value) => () => {
    const currentIndex = Answers.indexOf(value);
    const newChecked = [...Answers];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setAnswers(newChecked);
    console.log(Answers);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.target.value == "") {
        SetError(true);
        return;
      }
      let isTrue = false;
      Options.forEach((el) => {
        if (event.target.value === el) {
          SetError(true);
          SetErrorText("Такой вариант ответа уже есть");
          isTrue = true;
        }
      });
      if (!isTrue) {
        setOptions(Options.concat(event.target.value));
        event.target.value = "";
        console.log("Options:", Options);
      }
    }
  };
  const handleChangeErr = () => {
    SetError(false);
    SetAlertOpen(false);
    SetErrorText("Не должно быть пустым");
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const nameavlChange = (e) => {
    if (e.target.value === "") {
      SetError1(true);
    } else {
      SetError1(false);
      setNameval(e.target.value);
    }
  };
  const usernameavlChange = (e) => {
    if (e.target.value === "") {
      SetError2(true);
    } else {
      SetError2(false);
      setUsernameval(e.target.value);
    }
  };
  const textvalChange = (e) => {
    if (e.target.value === "") {
      SetError3(true);
    } else {
      SetError3(false);
      setTextval(e.target.value);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    let PromAns = [...Answers];
    let idans = Answers.indexOf(Options[id]);
    PromAns.splice(idans, 1);
    setAnswers(PromAns);

    let PromOpt = [...Options];
    PromOpt.splice(id, 1);

    setOptions(PromOpt);
  };

  const handleOkClose = () => {
    let CanFetch = true;
    if (nameavl === "") {
      SetError1(true);
      CanFetch = false;
    }
    if (usernameavl === "") {
      SetError2(true);
      CanFetch = false;
    }
    if (textval === "") {
      SetError3(true);
      CanFetch = false;
    }
    if (Options.length == 0) {
      SetError(true);
      CanFetch = false;
    }
    if (Answers.length == 0) {
      SetAlertOpen(true);
    }
    if (CanFetch) {
      const postBody = {
        name: nameavl,
        username: usernameavl,
        question: textval,
        options: Options,
        ans: Answers,
      };
      console.log(postBody);
      const requestMetadata = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
      };

      fetch("https://"+props.addr+"/newq", requestMetadata)
        .then((res) => res.json())
        .then((recipes) => {
          console.log(recipes);
        });
      setOpen(false);
      window.location.reload();
    }
  };


  return (
    <div>
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Создать Задачу
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Создание Задачи</DialogTitle>
        <DialogContent>
          <Collapse in={AlertOpen}>
            <Alert
              variant="outlined"
              severity="warning"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    SetAlertOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Необходимо указать правильные Варианты ответа
            </Alert>
          </Collapse>
          <TextField
            id="name"
            label="Название"
            style={{ marginBottom: 15 }}
            type="text"
            fullWidth
            variant="standard"
            helperText={error1 ? ErrText : ""}
            error={error1}
            onChange={nameavlChange}
          />
          <TextField
            id="username"
            label="Ваше Имя"
            type="text"
            style={{ marginBottom: 15 }}
            fullWidth
            error={error2}
            variant="standard"
            helperText={error2 ? ErrText : ""}
            onChange={usernameavlChange}
          />
          <TextField
            id="outlined-multiline-static"
            label="Текст Задачи"
            multiline
            style={{ marginBottom: 15 }}
            fullWidth
            helperText={error3 ? ErrText : ""}
            rows={4}
            error={error3}
            onChange={textvalChange}
          />
          <TextField
            id="standard-basic"
            fullWidth
            helperText={error ? errorText : ""}
            error={error}
            style={{ marginBottom: 10 }}
            label="Варианты ответа"
            placeholder="Введие вариант ответа и нажмите Enter"
            onKeyPress={handleKeyPress}
            onChange={handleChangeErr}
            variant="standard"
          />
          <List sx={{ width: "90%" }}>
            {Options.map((value, idM) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem
                  key={value}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={handleDelete.bind(this, idM)}
                      aria-label="comments"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={Answers.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleOkClose}>Ок</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
