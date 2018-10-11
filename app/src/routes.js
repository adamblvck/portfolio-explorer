import React from 'react';
import { Route, Router, BrowserRouter, Switch} from 'react-router-dom';
import Auth from './auth/auth';
import history from './history';

import App from './components/app';
import Callback from './callback/Callback';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication();
    }
}

export const makeMainRoutes = () => {
    return (



        <Router history={history} component={App}>
            <div>
                <Route 
                    path="/"
                    render={(props) => <App auth={auth} {...props} />}    
                />

                {/* <Route
                    path="/callback"
                    render={(props) => {
                        handleAuthentication(props);
                        return <Callback {...props} />
                    }}
                /> */}
            </div>
        </Router>
    )
}