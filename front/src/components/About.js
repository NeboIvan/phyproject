import {useParams} from "react-router-dom";
import React, {useState, useEffect} from "react";
import Nav from "./others/nav";
import SendIcon from '@mui/icons-material/Send';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'

export default function About(props) {
    const [error, setError] = useState(null);
    const [Chosed, setChosed] = useState([]);
    const [Count, setCount] = useState(-1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [item, setItem] = useState(null);
    let {id} = useParams();


    const handleToggle = (value) => () => {
        const currentIndex = Chosed.indexOf(value);
        const newChecked = [...Chosed];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChosed(newChecked);
        console.log(Chosed);
    };

    const CheckAnswers = () => {
        let cool = 100;

        for (var i = 0; i < Chosed.length; i += 1) {
            if (item.ans.indexOf(Chosed[i]) == -1) {
                cool = 0;
            }
        }

        setCount(cool);
    }


    useEffect(() => {
        fetch(props.netMet + "://" + props.addr + "/q/" + id).then((res) => res.json()).then((result) => {
            setIsLoaded(true);
            setItem(result);
        }, (error) => {
            setIsLoaded(true);
            setError(error);
        });
    }, []);
    console.log(item);

    if (error) {
        return (
            <div>
                <Nav/>
                <p>Error: {
                    error.message
                }</p>
            </div>
        );
    } else if (!isLoaded) {
        return (
            <div>
                <Nav/>
                <p>Loading...</p>
            </div>
        );
    } else if (Count != -1) {
        console.log("Count " + Count);
        return (
            <div>
                <Nav/>
                <Grid container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={
                        {minHeight: '100vh'}
                }>
                    <Card sx={
                        {maxWidth: 345}
                    }>
                        <CardActionArea>
                            <CardMedia component="img" height="200"
                                image={
                                    Count == 100 ? "https://file.io/c4QXRLjgObOd" : "https://file.io/yd3RgHpd8QBq"
                                }
                                alt="green iguana"/>
                            <CardContent style={
                                {textAlign: "center"}
                            }>
                                <Typography gutterBottom variant="h5" component="div">
                                    {
                                    Count === 100 ? "Поздравляем!" : "Надо еще подумать"
                                } </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Вы набрали {Count} баллов
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        { (Count == 0) && 
                            <Button style={
                                    {
                                        width: "100%",
                                        marginTop: "1%"
                                    }
                                }
                                variant="contained"
                                onClick={ () => setCount(-1)}>
                                Решить ещё раз
                            </Button>
                          }
                    </Card>
                </Grid>
            </div>
        );
    } else {
        if (item) {
            return (
                <div>
                    <Nav/>
                    <Grid container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        style={
                            {minHeight: '100vh'}
                    }>

                        <Card sx={
                            {
                                maxWidth: "850px",
                                minWidth: "200px"
                            }
                        }>
                            <CardContent>
                                <Typography sx={
                                        {fontSize: 14}
                                    }
                                    color="text.secondary"
                                    gutterBottom>
                                    {
                                    item.username
                                } </Typography>
                                <Typography variant="h5" component="div">
                                    {
                                    item.name
                                } </Typography>
                                <Typography sx={
                                        {mb: 1.5}
                                    }
                                    color="text.secondary">
                                    100 балов
                                </Typography>
                                <Typography variant="body2">
                                    {
                                    item.question
                                } </Typography>
                            </CardContent>
                            {
                            item.options.map((value, idM) => {
                                const labelId = `checkbox-list-label-${value}`;

                                return (
                                    <ListItem key={value}
                                        disablePadding>
                                        <ListItemButton role={undefined}
                                            onClick={
                                                handleToggle(value)
                                            }
                                            dense>
                                            <ListItemIcon>
                                                <Checkbox edge="start"
                                                    checked={
                                                        Chosed.indexOf(value) !== -1
                                                    }
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={
                                                        {"aria-labelledby": labelId}
                                                    }/>
                                            </ListItemIcon>
                                            <ListItemText id={labelId}
                                                primary={value}/>
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        } </Card>

                        <Button style={
                                {
                                    width: "30%",
                                    marginTop: "1%"
                                }
                            }
                            variant="contained"
                            endIcon={<SendIcon/>}
                            onClick={CheckAnswers}>
                            Ответить
                        </Button>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div>
                    <Nav/>
                    <h2>404 NO INFO</h2>
                </div>
            );
        }
    }
}
