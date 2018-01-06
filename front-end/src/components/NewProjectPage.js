import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addProject } from '../actions';
import {
  Grid
, Row
, Col
, Button
, FormGroup
, FormControl
, ControlLabel
, HelpBlock
} from 'react-bootstrap';

class NewProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    /* prebind TODO is this actually useful? */
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }
  onChange(ev) {
    this.setState({
      value: ev.target.value
    })
  }
  onSubmit(ev) {
    ev.preventDefault();
    this.props.addProject({
      name: this.state.value
    })
  }
  validate() {
    /* reject existing project names */
    return this.state.value
    ? !this.props.projects.some(project =>
        project.name === this.state.value
      )
      ? 'success'
      : 'error'
    : null
  }
  render() {
    return <div className="container">
      <h1>New Project</h1>
      <form onSubmit={this.onSubmit}>
        <FormGroup
          controlId="newProjectNameEntry"
          validationState={this.validate()}
        >
          <ControlLabel>Project Name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="e.g. technologies"
            onChange={this.onChange}
          />
          <FormControl.Feedback/>
          <HelpBlock>Enter a name for your new project.</HelpBlock>
        </FormGroup>
      </form>
    </div>
  }
}

export default connect(
  state => ({
    projects: state.app.projects
  })
, dispatch => bindActionCreators({
    addProject
  }, dispatch)
)(NewProjectPage);
