import router from './routes';

export default ({ getState, dispatch }) => next => action => {
  if (action.type == '@@router/LOCATION_CHANGE') {
    // XXX as a temporary hack, I'm sticking a reference to our store's
    // dispatch() function onto the router TODO TODO TODO FIXME
    router.dispatch = dispatch;
    router.route(action.payload.pathname);
  }
  console.log('action:', action);
  console.log('state:', getState());
  return next(action);
}
