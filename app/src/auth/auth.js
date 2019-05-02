import auth0 from 'auth0-js';
import history from '../history';

import { getUserInfo } from  '../actions/user';

import store from '../store';

const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const CALLBACK_URL = isLOCALHOST
    ? 'http://localhost:8080/callback'
    : 'https://blockchain-ecosystem-explorer.herokuapp.com/callback';

const shallowCompare = (obj1, obj2) =>
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(key => 
      obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
    );

function shallow(o1, o2){
    if (o1 === null && o2 !== null)
        return true;
    if (o2 === null && o1 !== null)
        return true;

    if (o1.modified != o2.modified)
        return true;
    else
        return false;
}

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: 'blockchainexplorer.eu.auth0.com',
        clientID: 'nmwFAcrQ4iKBlNNqjNuoFjzJwDMlkkJK',
        redirectUri: CALLBACK_URL,
        responseType: 'token id_token',
        scope: 'openid email'
    });

    constructor(){
        this.handleStoreChange = this.handleStoreChange.bind(this);

        this.unsubscribe = store.subscribe(this.handleStoreChange);
        this.prevauth = store.getState().auth;

        // check if still authenticated, if not, reset tokenstore
        if (!this.isAuthenticated()){
            this.logout();
        }
    }

    handleStoreChange(){
        const auth = store.getState().auth;
        if ( auth === undefined || auth === null)
            return;

        if (shallow(this.prevauth, auth)){
            console.log("auth store change:", this.prevauth, auth);

            this.prevauth = {...auth};

            // if (history.location.pathname.localeCompare("/u/new"))
            //     return;

            if (auth.user == null){
                history.replace('/u/new');
            } else {
                localStorage.setItem('user', auth.user);
                history.replace('/');
            }
        }
    }

    login() {
        this.auth0.authorize();
    }    

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            // authResult contains info returned in the URL on /callback
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);

                store.dispatch(getUserInfo(authResult));

                //history.replace('/');
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

        // history.replace('/'); // navigate home
    }

    logout() {
        // remove all authentiation entries stored in the storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('is_authenticated');
        localStorage.removeItem('user');
        localStorage.setItem('expires_at', 0);
    }

    isAuthenticated() {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));

        if (expiresAt == null){
            this.logout();
            return false;
        }

        const isAuth = new Date().getTime() < expiresAt;
        isAuth ? localStorage.setItem('is_authenticated', true) : localStorage.removeItem('is_authenticated');
        return isAuth;
    }
}