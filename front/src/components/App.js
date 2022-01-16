import "./App.css";
import Home from  "./Home"
import About from  "./About"
import Profile from "./Profile"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const address = "back-82-202-247-237.nip.io";
  const Netmethod = "https";
  //const address = "127.0.0.1:8080";
  return (
    <Router>
      <Switch>
        <Route path="/qests/:id">  
          <About netMet={Netmethod} addr={address}/>
        </Route>
        <Route path="/profile">
          <Profile netMet={Netmethod} addr={address}/>
        </Route> 
        <Route path="/">
          <Home netMet={Netmethod} addr={address}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
