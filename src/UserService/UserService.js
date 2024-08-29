import _kc from '../keycloak.js'
// let initOptions = {
//   url: 'https://www.cats.com.kh/auth',
//   realm: 'cats',
//   clientId: 'incident-system-frontend',
//   onLoad: 'login-required', // check-sso | login-required
//   KeycloakResponseType: 'code',
//   // silentCheckSsoRedirectUri: window.location.origin + "/apps/incident/silent-check-sso.html",
// }



// const storedToken = localStorage.getItem('access_token');
// const storedRefreshToken = localStorage.getItem('refresh_token');


// const initKeycloak = () => {
//   _kc.init({
//     onLoad: initOptions.onLoad,
//     KeycloakResponseType: 'code',
//     silentCheckSsoRedirectUri: window.location.origin + "/apps/incident/silent-check-sso.html", checkLoginIframe: false,
//     pkceMethod: 'S256',
//     token: storedToken,
//     refreshToken: storedRefreshToken
//   })
//     .then((authenticated) => {

//       if (!authenticated) {
//         doLogin()
//         console.log("user is not authenticated..!");
//       }

//       localStorage.setItem("access_token", getToken());
//       localStorage.setItem("refresh_token", _kc.refreshToken);
//       localStorage.setItem("profile", UserService.getLastname())
//       localStorage.setItem("Id", UserService.getUsername())
//       let role = UserService.getrole();
//       localStorage.setItem("role", [role])
//       localStorage.setItem("is_login", "1")
//       setTimeout(() => {
//         // if the access token is due to expire within the next 80 seconds refresh it
//         _kc.updateToken(60).then((refreshed) => {
//           if (refreshed) {
//             console.log(`Dashboard access-token refreshed ` + refreshed);
//           }
//         }).catch(() => {
//           console.log(`Dashboard Failed to refresh authentication tokens`);
//         });
//       }, 60 * 1000)

//       axios.interceptors.request.use(config => (
//         _kc.updateToken(60)
//           .then(() => {
//             config.headers.Authorization = 'Bearer ' + _kc.token;
//             return Promise.resolve(config)
//           })
//           .catch(
//             _kc.doLogin
//           )
//       ));

//       console.log("user is authenticated..!");

//     })
//     .catch(console.error);

// }




// const initKeycloak = (onAuthenticatedCallback) => {
//   _kc.init({
//     onLoad: initOptions.onLoad,checkLoginIframe: false,
//     KeycloakResponseType: 'code',
//     silentCheckSsoRedirectUri: window.location.origin + "/apps/incident/silent-check-sso.html",
//     pkceMethod: 'S256'
//   })
//     .then((authenticated) => {
//       if (authenticated) {


//       }
//       localStorage.setItem("access_token", getToken());
//       localStorage.setItem("refresh_token", _kc.refreshToken);
//       localStorage.setItem("profile", UserService.getLastname())  
//       role = getrole();
//       localStorage.setItem("role", [role])

//       console.log("user is authenticated..!");
//       axios.interceptors.request.use(config => (
//         _kc.updateToken(20)
//           .then(() => {
//             config.headers.Authorization = 'Bearer ' + _kc.token;
//             return Promise.resolve(config)
//           })
//           .catch(
//             _kc.login
//             )
//       ));

//       setInterval(() => {
//         _kc.updatetoken(70).then((refreshed) => {
//             if (refreshed) {
//                 store_token(_kc.token)
//                 console.debug('token refreshed');
//             } else {
//                 console.warn('token not refreshed');
//             }
//         }).catch(() => {
//             console.error('failed to refresh token');
//         });
//     }, 50000)

//     //   setTimeout(() => {
//     //     // if the access token is due to expire within the next 80 seconds refresh it
//     //     _kc.updateToken(20).then((refreshed) => {
//     //         if (refreshed) {
//     //             console.log(`Dashboard access-token refreshed `+ refreshed);
//     //         }
//     //     }).catch(() => {
//     //         console.log(`Dashboard Failed to refresh authentication tokens`);
//     //         window.location.href = '/apps/incident/home';
//     //     });
//     // }, 60 * 1000)
//         // doLogin()
//         // // localStorage.setItem("is_login", "0")
//         // console.log("user is not authenticated..!");



//     })
//     .catch(console.error);
//   }


// login-required

const doLogin = _kc.login;

const doLogout = _kc.logout;

const account = _kc.accountManagement;

const getToken = () => _kc.token;

const getrole = () => JSON.stringify(_kc.tokenParsed?.realm_access.roles);

const refreshToken = () => _kc.refreshToken;

const isLoggedIn = () => !!_kc.token;
const LoggedIn = () => _kc.token;
const updateToken = (successCallback) =>
  _kc.updateToken(60)
    .then(successCallback)
    .catch(doLogin());


const getUsername = () => _kc.tokenParsed?.preferred_username;
const getLastname = () => _kc.tokenParsed?.family_name;
const getEmail = () => _kc.tokenParsed?.email;
const authenticated = () => _kc.authenticated;
const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));



const UserService = {
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
  refreshToken,
  getLastname,
  LoggedIn,
  getEmail,
  authenticated,
  account,
  getrole,
};

export default UserService;
