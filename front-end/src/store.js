import {
  createStore
, combineReducers
, applyMiddleware
} from 'redux';
import reduxThunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import myMiddleware from './store-middleware';
import appReducer from './reducers/app';
import router from './routes';

const history = createHistory();
// XXX TODO this is probably not a great way to give the router access to
// our history object
window.__history = router.history = history;
const middleware = routerMiddleware(history);

const store = createStore(
  combineReducers({
    router: routerReducer
  , app: appReducer
  })
, applyMiddleware(reduxThunk, myMiddleware, middleware)
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
