import "./App.css";
import Home from  "./Home"
import About from  "./About"
import Profile from "./Profile"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const address = "localhost:8080";
  return (
    <Router>
      <Switch>
        <Route path="/qests/:id">  
          <About addr={address}/>
        </Route>
        <Route path="/profile">
          <Profile addr={address}/>
        </Route> 
        <Route path="/">
          <Home addr={address}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
