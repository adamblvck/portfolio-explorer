/*
  Author: Adam Blvck (adamblvck.com)
  Product: Blockchain Ecosystem Explorer
  Year: 2018
  For Smartie.be
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

import { Route, Router, BrowserRouter, Switch} from 'react-router-dom';

import HomeOverview from './containers/overview/home_overview';
import Board from './containers/board/board';

// Forms
import FormNewUser from './containers/forms/form_newuser';

// Callback information (after a webhook call)
import Callback from './callback/callback';

// Authentication information
import Auth from './auth/auth';
import history from './history';

// const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

// Stylish background 
import Particles from 'react-particles-js';
import particlesConfig from '../configs/particlesjs-config';

// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import store from './store';

// create redux store
// const store = createStoreWithMiddleware(reducers);

// create authentication handler
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
    <ThemeProvider theme={myTheme}>
        <Provider store={store}>
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
                            path="/u/new" 
                            render={
                                (props) => <FormNewUser auth={auth} {...props} />
                            }
                        />

                        {/* Show specific bubble */}
                        <Route 
                            path="/b/:id" 
                            render={
                                (props) => <Board auth={auth} {...props} />
                            }    
                        />

                        {/* Show bubbles */}
                        <Route 
                            path="/" 
                            render={
                                (props) => <HomeOverview auth={auth} {...props} />
                            }    
                        />
                    </Switch>
                </div>
            </Router>
        </Provider>

        {/* <Particles
            className="particle-background"
            params={particlesConfig}
            style={{
                width: '100%'
            }}
        /> */}

    </ThemeProvider>
    , document.querySelector('.container'));
