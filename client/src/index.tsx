import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {stores} from './store/stores';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router';
import {Provider} from 'mobx-react';
import {Game} from './screens/game';

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
      <BrowserRouter>
        <>
          <Route exact path="/" component={Game} />
          {/*<Route path="/register" component={Register} />*/}
          {/*<Route path="/login" component={Login} />*/}
        </>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
