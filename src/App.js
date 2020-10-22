import React from 'react';
import { Switch, Route } from 'react-router-dom'

// Containers
import { DesktopContainer } from './containers'

// Components
import { Homepage } from './components/pages'

import './App.less'

function App() {
  return (
    <DesktopContainer>
      <Switch>
        <Route exact path='/' component={Homepage} />
      </Switch>
    </DesktopContainer>
  );
}

export default App;

