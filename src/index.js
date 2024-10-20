import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const stateKey = "calculatorState";

function getInitialState() {
  try {
    const values = JSON.parse(window.localStorage.getItem(stateKey));
    Object.entries(values || {}).forEach(([key, value]) => {
      if (isNaN(parseInt(value))) {
        throw new Error(`Not a number! key: ${key}, value: ${value}`);
      }
    });
    return values;
  } catch (e) {
    console.warn("State parse error", e);
    return null;
  }
}

const savedState = getInitialState();
const initialState = savedState || {
  saved: 100000,
  years: 10,
  monthlySavings: 10000,
  interest: 5,
  target: 3000000,
};

let appState = initialState;

function handleWindowClose() {
  window.localStorage.setItem(stateKey, JSON.stringify(appState));
}

window.addEventListener("beforeunload", handleWindowClose);
window.addEventListener("unload", handleWindowClose);

function AppContainer() {
  const [state, setState] = React.useState(initialState);
  appState = state;

  return (
    <App
      yearNow={new Date().getFullYear()}
      state={state}
      setState={(nextState) => {
        setState(nextState);
      }}
    />
  );
}

ReactDOM.render(<AppContainer />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
