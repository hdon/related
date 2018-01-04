/* TODO don't let this become a giant monolithic reducer, maybe? */
import {
  GITHUB_EVENTS
} from '../actions/actionTypes';

const initState = {
  githubEvents: []
}

export default (state=initState, action) => {
  switch (action.type) {
    case GITHUB_EVENTS:
      return {
        ...state
      , githubEvents: action.githubEvents
      }
    default:
      return state;
  }
}
