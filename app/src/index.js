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

import Bubble from './components/bubble';
import BubbleOverview from './components/bubbles_overview';
import Callback from './callback/callback';
import Auth from './auth/auth';
import history from './history';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);


import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication();
    }
}

const myTheme = createMuiTheme({
    typography: {
     "fontFamily": '"Nunito", "Roboto", "Helvetica", "Arial", "sans-serif"',
     "fontSize": 14,
     "fontWeightLight": 300,
     "fontWeightRegular": 400,
     "fontWeightMedium": 500
    }
 });

ReactDOM.render(
    <MuiThemeProvider theme={myTheme}>
        <Provider store={createStoreWithMiddleware(reducers)}>
        <Router history={history}>
            <div>
                {/* Switch matches only a single Route */}
                <Switch> 
                    {/* callback for auth */}
                    <Route 
                        path="/callback" 
                        render={(props) => {
                            handleAuthentication(props);
                            return <Callback {...props} />
                    }}/>
                    {/* Show specific bubble */}
                    <Route 
                        path="/b/:id" 
                        render={
                            (props) => <Bubble auth={auth} {...props} />
                        }    
                    />
                    {/* Show bubbles */}
                    <Route 
                        path="/" 
                        render={
                            (props) => <BubbleOverview auth={auth} {...props} />
                        }    
                    />
                </Switch>
            </div>
        </Router>

        </Provider>
    </MuiThemeProvider>
    , document.querySelector('.container'));
