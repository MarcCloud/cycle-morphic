import { makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/core';
import {Observable} from 'rx';
import App from './app';

let {sinks, sources} = run(App, {
    DOM: makeDOMDriver('#root'),
    context: ()=> window.CTX$
});
if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    sinks.dispose();
    sources.dispose();
  });
}
