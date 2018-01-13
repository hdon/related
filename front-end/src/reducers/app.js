/* TODO don't let this become a giant monolithic reducer, maybe? */
import {
  GITHUB_EVENTS
, FETCH_PROJECTS
, PROJECT_VIEW_SUCCESS
, FETCH_COMPARANDS_REQUEST
, FETCH_COMPARANDS_SUCCESS
, FETCH_COMPARANDS_FAILURE
, FETCH_ENTITIES_REQUEST
, FETCH_ENTITIES_SUCCESS
, FETCH_ENTITIES_FAILURE
, DELETE_ENTITY_REQUEST
, DELETE_ENTITY_SUCCESS
, DELETE_ENTITY_FAILURE
, POST_ENTITY_REQUEST
, POST_ENTITY_SUCCESS
, POST_ENTITY_FAILURE
, FETCH_ENTITIES_AND_RELATEDS_REQUEST
, FETCH_ENTITIES_AND_RELATEDS_SUCCESS
, FETCH_ENTITIES_AND_RELATEDS_FAILURE
} from '../actions/actionTypes';

const initState = {
  githubEvents: []
, projects: []
, project: {}
, comparands: null
, spinning: false
, err: null
, relateds: []
, entities: null
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
    case FETCH_ENTITIES_SUCCESS:
      return {
        ...state
      , spinning: false
      , entities: action.entities
      }
    case DELETE_ENTITY_SUCCESS:
      return {
        ...state
      , spinning: false
      , entities: state.entities.filter(ent => ent.id !== action.id)
      }
    case POST_ENTITY_SUCCESS:
      return {
        ...state
      , spinning: false
      , entities: [ ...state.entities, action.entity ]
      }
    case FETCH_ENTITIES_AND_RELATEDS_SUCCESS:
      return {
        ...state
      , spinning: false
      , entities: action.entities
      , relateds: action.relateds
      }
    default:
      return state;
  }
}
