/* Here we configure our front-end router. See router.js for more.
 */
import Router from './router';
import axios from 'axios';
import API from '../lib/api';
import {
  GITHUB_EVENTS
, FETCH_PROJECTS
} from '../actions/actionTypes';
import {
  viewProject
, fetchComparands
, fetchEntities
} from '../actions';
const router = new Router();
// TODO don't put this setting in revision control. maybe define it in our
// webpack configuration somewhere
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
  /* TODO handle errors */
})
router.enter('/projects', () => {
  axios.get(API + '/project')
  .then(res => {
    router.dispatch({
      type: FETCH_PROJECTS
    , projects: res.data
    })
  })
})
/* conflicts with the next route, so give it empty handler */
router.enter('/projects/new', Function.prototype);
router.enter('/projects/:project_id', ({ params }) =>
  viewProject(params.project_id)(router.dispatch)
);
router.enter('/projects/:project_id/input', ({ params }) => {
  viewProject(params.project_id)(router.dispatch);
  fetchComparands(params.project_id)(router.dispatch);
})
router.enter('/projects/:project_id/entities', ({ params }) => {
  viewProject(params.project_id)(router.dispatch);
  fetchEntities(params.project_id)(router.dispatch);
})
  

export default router;
