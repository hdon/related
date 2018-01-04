import Router from './router';
import {
  GITHUB_EVENTS
} from '../actions/actionTypes';
const router = new Router();
router.enter('/', () => {
  fetch('https://api.github.com/repos/hdon/putty-known-hosts/events')
  .then($ => $.json())
  .then($ => {
    router.dispatch({
      type: GITHUB_EVENTS
    , githubEvents: $
    })
    console.log(window.__github = $);
  })
})
router.enter('/projects', () => {
  alert('welcome to projects page');
})
export default router;
