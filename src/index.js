import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Data from './Data';


ReactDOM.render(
  <React.StrictMode>
    <div class="container">
    <Data />
    <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
