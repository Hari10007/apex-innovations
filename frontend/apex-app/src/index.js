import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from "react-redux"
import store from './redux-toolkit/store'
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
let persistor = persistStore(store);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <PersistGate persistor = {persistor}>
          <App />
        </PersistGate>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

