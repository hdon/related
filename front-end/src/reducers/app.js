/* TODO don't let this become a giant monolithic reducer, maybe? */
import {
  GITHUB_EVENTS
, FETCH_PROJECTS
, PROJECT_VIEW_SUCCESS
, FETCH_COMPARANDS_REQUEST
, FETCH_COMPARANDS_SUCCESS
, FETCH_COMPARANDS_FAILURE
} from '../actions/actionTypes';

const initState = {
  githubEvents: []
, projects: []
, project: {}
, comparands: null
, spinning: false
, err: null
}

/* TODO more event types need to set spinning and err state */
export default (state=initState, action) => {
  switch (action.type) {
    case GITHUB_EVENTS:
      return {
        ...state
      , githubEvents: action.githubEvents
      }
    case FETCH_PROJECTS:
      return {
        ...state
      , projects: action.projects
      }
    case PROJECT_VIEW_SUCCESS:
      return {
        ...state
      , project: action.project
      }
    case FETCH_COMPARANDS_REQUEST:
      return {
        ...state
      , comparands: null
      , spinning: true
      }
    case FETCH_COMPARANDS_SUCCESS:
      return {
        ...state
      , comparands: action.comparands
      , spinning: false
      }
    case FETCH_COMPARANDS_FAILURE:
      return {
        ...state
      , spinning: false
      , err: action.err
      }
    default:
      return state;
  }
}
