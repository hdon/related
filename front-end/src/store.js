import {
  createStore
, combineReducers
, applyMiddleware
} from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import myMiddleware from './store-middleware';
import appReducer from './reducers/app';

const history = createHistory();
const middleware = routerMiddleware(history);

const store = createStore(
  combineReducers({
    router: routerReducer
  , app: appReducer
  })
, applyMiddleware(myMiddleware, middleware)
);

// cheap way to access store from console
window.__store = store;

store.subscribe(function() {
  console.log('subscribe!', arguments);
})

export {
  store
, history
}
