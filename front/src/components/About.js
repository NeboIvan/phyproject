import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Nav from "./others/nav";

export default function About() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [item, setItem] = useState(null);
  let { id } = useParams();

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("http://5.188.158.130:5081/q/" + id)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItem(result);
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
  console.log(item);

  if (error) {
    return (
      <div>
        <Nav />
        <p>Error: {error.message}</p>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Nav />
        <p>Loading...</p>
      </div>
    );
  } else {
    if (item) {
      return (
        <div>
          <Nav />
          <h4>Название:</h4>
          <p>{item.name}</p>
          <h4>Текст:</h4>
          <p>{item.question}</p>
          <h4>Имя пользователя:</h4>
          <p>{item.username}</p>
          <h4>Варианты ответа:</h4>
          {item.options.map((el, i) => {
            {
              console.log(el);
            }
            return <p> {i+1}. {el} </p>;
          })}
          <h4>Правильные ответы:</h4>
          {item.ans.map((el) => {
            {
              console.log(el);
            }
            return <p> - {el}</p>;
          })}
          <h4>Дата:</h4>
          <p>{item.date}</p>
        </div>
      );
    } else {
      return (
        <div>
          <Nav />
          <h2>404 NO INFO</h2>
        </div>
      );
    }
  }
}
