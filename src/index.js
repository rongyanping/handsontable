import React from "react";
import ReactDOM from "react-dom";
import Router from './router';

import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./store";


function monitor() {
  const LOG_TAG = "performance";
  let timing = performance?.timing

  const observer = new PerformanceObserver((list) => {
    const perfEntries = list.getEntries();
    perfEntries.forEach((entity) => {
      // console.info(LOG_TAG, entity.name, entity.duration, entity.startTime);
      console.info('entity---', entity.name, entity.startTime);
    })

    // console.log(LOG_TAG, "fetchStart", timing.fetchStart - timing.navigationStart);
    // console.log(LOG_TAG, "domInteractive", timing.domInteractive - timing.navigationStart);
    // console.log(LOG_TAG, "TTI", timing.domInteractive - timing.fetchStart);
  });
  // register observer for paint timing notifications
  observer.observe({ entryTypes: ["paint"] });

  // tslint:disable-next-line: forin
  console.info(LOG_TAG, 'timing---', timing);
}

monitor();

ReactDOM.render(
  <Router/>,
  // <Provider store={store}>
  //   <App />
  // </Provider>,
  document.getElementById("root")
);

monitor();

serviceWorker.unregister();
