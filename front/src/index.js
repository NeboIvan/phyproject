import React from "react";
import ReactDOM from "react-dom";
import App from './components/App.js';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <Auth0Provider
    domain="phytests.us.auth0.com"
    clientId="SJ0TbyNOgurifaY0058lL4XlVBPmmjAW"
    redirectUri={window.location.origin}
    audience="https://phytests.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);