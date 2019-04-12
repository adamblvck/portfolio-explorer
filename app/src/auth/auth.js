import auth0 from 'auth0-js';
import history from '../history';

const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const CALLBACK_URL = isLOCALHOST
    ? 'http://localhost:8080/callback'
    : 'https://blockchain-ecosystem-explorer.herokuapp.com/callback';

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: 'blockchainexplorer.eu.auth0.com',
        clientID: 'nmwFAcrQ4iKBlNNqjNuoFjzJwDMlkkJK',
        redirectUri: CALLBACK_URL,
        responseType: 'token id_token',
        scope: 'openid email'
    });

    login() {
        this.auth0.authorize();
    }    

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            // authResult contains info returned in the URL on /callback
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                history.replace('/');
            } 
            // on error
            else if (err) {
                history.replace('/');
                console.log(err);
            }
        })
    }

    setSession(authResult) {
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('is_authenticated', true);

        history.replace('/'); // navigate home
    }

    logout() {
        // remove all authentiation entries stored in the storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('is_authenticated');
        localStorage.setItem('expires_at', 0);
    }

    isAuthenticated() {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        const isAuth = new Date().getTime() < expiresAt;
        isAuth ? localStorage.setItem('is_authenticated', true) : localStorage.removeItem('is_authenticated');
        return isAuth;
    }
}