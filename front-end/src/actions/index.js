/* You might be expecting to see action creators in here. Sorry to
 * disappoint. Instead here we have functions which create and dispatch
 * their own actions, and also make requests to servers.
 */
import axios from 'axios';
import API from '../lib/api';
import router from '../routes';
import QS from 'query-string';
import {
  ADD_PROJECT_REQUEST
, ADD_PROJECT_SUCCESS
, ADD_PROJECT_FAILURE
, PROJECT_VIEW_REQUEST
, PROJECT_VIEW_SUCCESS
, PROJECT_VIEW_FAILURE
, FETCH_COMPARANDS_REQUEST
, FETCH_COMPARANDS_SUCCESS
, FETCH_COMPARANDS_FAILURE
, SEND_COMPARISON_REQUEST
, SEND_COMPARISON_SUCCESS
, SEND_COMPARISON_FAILURE
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
} from './actionTypes';

const addProject = project => dispatch => {
  dispatch({ type: ADD_PROJECT_REQUEST })
  axios.post(API + '/project', project)
  .then(res => {
    console.log('project=', res.data);
    dispatch({ type: ADD_PROJECT_SUCCESS })
    router.history.push('/projects/' + res.data.id);
    // TODO we need a reference to our history push function to redirect
    // the browser to the page of the newly created project!
  }).catch(err => {
    dispatch({ type: ADD_PROJECT_FAILURE, err })
  })
}

const viewProject = project_id => dispatch => {
  dispatch({ type: PROJECT_VIEW_REQUEST });
  axios.get(API + '/project/' + project_id)
  .then(res => {
    dispatch({ type: PROJECT_VIEW_SUCCESS, project: res.data })
  }).catch(err => {
    dispatch({ type: PROJECT_VIEW_FAILURE, err })
  })
}

const fetchComparands = project_id => dispatch => {
  dispatch({ type: FETCH_COMPARANDS_REQUEST });
  axios.get(API + '/comparands/' + project_id)
  .then(res => {
    dispatch({ type: FETCH_COMPARANDS_SUCCESS, comparands: res.data })
  }).catch(err => {
    dispatch({ type: FETCH_COMPARANDS_FAILURE, err })
  })
}

const sendComparison = (a, b) => dispatch => {
  dispatch({ type: SEND_COMPARISON_REQUEST });
  axios.post(API + '/related', { a, b })
  .then(res => {
    dispatch({ type: SEND_COMPARISON_SUCCESS })
  }).catch(err => {
    dispatch({ type: SEND_COMPARISON_FAILURE, err })
  })
}

const fetchEntities = project_id => dispatch => {
  dispatch({ type: FETCH_ENTITIES_REQUEST })
  axios.get(API + '/entity?'
  + QS.stringify({ where:
      JSON.stringify({
        project: project_id
      })
    })
  ).then(res => {
    dispatch({ type: FETCH_ENTITIES_SUCCESS, entities: res.data })
  }).catch(err => {
    dispatch({ type: FETCH_ENTITIES_FAILURE, err })
  })
}

const deleteEntity = id => dispatch => {
  dispatch({ type: DELETE_ENTITY_REQUEST });
  axios.delete(API + '/entity/' + id)
  .then(res => {
    dispatch({ type: DELETE_ENTITY_SUCCESS, id })
  }).catch(err => {
    dispatch({ type: DELETE_ENTITY_FAILURE, err })
  })
}

const addEntity = (name, project) => dispatch => {
  dispatch({ type: POST_ENTITY_REQUEST });
  axios.post(API + '/entity', { name, project })
  .then(res => {
    dispatch({ type: POST_ENTITY_SUCCESS, entity: res.data })
  }).catch(err => {
    dispatch({ type: POST_ENTITY_FAILURE, err })
  })
}

const fetchEntitiesAndRelateds = project_id => dispatch => {
  dispatch({ type: FETCH_ENTITIES_AND_RELATEDS_REQUEST })
  axios.get(API + '/related/' + project_id)
  .then(res => {
    dispatch({
      type: FETCH_ENTITIES_AND_RELATEDS_SUCCESS
    , entities: res.data.entities
    , relateds: res.data.relateds
    })
  }).catch(err => {
    dispatch({ type: FETCH_ENTITIES_AND_RELATEDS_FAILURE, err })
  })
}

export {
  addProject
, viewProject
, fetchComparands
, sendComparison
, fetchEntities
, deleteEntity
, addEntity
, fetchEntitiesAndRelateds
}
