import React from "react";
import ReactDOM from "react-dom";
import App from './components/App.js';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <Auth0Provider
    domain="phyprj.us.auth0.com"
    clientId="qMLdjgnbWD4vCjxcdNQ5r7F2nLWsJEJC"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);