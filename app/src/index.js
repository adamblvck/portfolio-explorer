/*
  Author: Adam Blvck (adamblvck.com)
  Product: Blockchain Ecosystem Explorer
  Year: 2018
  Smartie.be
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

import { Route, Router, BrowserRouter, Switch} from 'react-router-dom';

import reducers from './reducers';

import App from './components/app';
import Callback from './callback/callback';
import Auth from './auth/auth';
import history from './history';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication();
    }
}

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={history}>
        <div>
            <Switch>
                <Route 
                    path="/callback" 
                    render={(props) => {
                        handleAuthentication(props);
                        return <Callback {...props} />
                }}/>
                <Route 
                    path="/" 
                    render={
                        (props) => <App auth={auth} {...props} />
                    }    
                />
            </Switch>
        </div>
    </Router>

  </Provider>
  , document.querySelector('.container'));
