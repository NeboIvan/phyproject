import "./App.css";
import Home from  "./Home"
import About from  "./About"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/qests/:id">  
          <About />
        </Route>
       {/*  <Route path="/users">
          <Users />
        </Route> */}
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
