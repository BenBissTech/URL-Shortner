import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBdK58vz_50J8gHpownPH-3JSGXoQqJlRs",
  authDomain: "url-short-d694b.firebaseapp.com",
  projectId: "url-short-d694b",
  storageBucket: "url-short-d694b.appspot.com",
  messagingSenderId: "448637750830",
  appId: "1:448637750830:web:ca171e9084511ad34d19bf",
  measurementId: "G-M28V83R73W"
};

initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
