import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import keycloak from './keycloak';
import UserService from './UserService/UserService';



const storedToken = localStorage.getItem('access_token');
const storedRefreshToken = localStorage.getItem('refresh_token');


  keycloak.init({
    onLoad: 'login-required', // check-sso | login-required
    KeycloakResponseType: 'code',
    silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", 
    checkLoginIframe: false,
    pkceMethod: 'S256',
    token: storedToken,
    refreshToken: storedRefreshToken
  })
    .then((authenticated) => {

      if (!authenticated) {
        console.log("user is not authenticated..!");
      }

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      localStorage.setItem("access_token", keycloak.token);
      localStorage.setItem("refresh_token", keycloak.refreshToken);
      localStorage.setItem("profile", UserService.getLastname())
      localStorage.setItem("Id", UserService.getUsername())
      let role = UserService.getrole();
      localStorage.setItem("role", [role])
      localStorage.setItem("is_login", "1")

      keycloak.updateToken(60).then((refreshed) => {
          if (refreshed) {
            console.log(`Dashboard access-token refreshed ` + refreshed);
          }
        }).catch(() => {
          UserService.doLogin()
          console.log(`Dashboard Failed to refresh authentication tokens`);
        });

      // axios.interceptors.request.use(config => (
      //   keycloak.updateToken(60)
      //     .then(() => {
      //       config.headers.Authorization = 'Bearer ' + keycloak.token;
      //       return Promise.resolve(config)
      //     })
      //     .catch(
      //       UserService.doLogin()
      //     )
      // ));
      
      console.log("user is authenticated..!");

    })







// UserService.initKeycloak(root);
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
