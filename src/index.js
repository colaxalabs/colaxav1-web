import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

// Redux persistor gate
import { PersistGate } from 'redux-persist/integration/react'

import App from './App';
import { store, persistor } from './store'
import history from './history'
import * as serviceWorker from './serviceWorker';

// Styling and fonts
import './index.css'
import './fonts/Apercu.ttf'

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Route component={App} />
        </PersistGate>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
