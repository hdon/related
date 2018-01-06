import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class ProjectPage extends React.Component {
  render() {
    return <div className="container">
      <h1>Project "{this.props.project.name}"</h1>
      <Row>
        <LinkContainer to={`/projects/${this.props.project.id}/input`}>
          <a>Start inputting data</a>
        </LinkContainer>
      </Row>
    </div>
  }
}

export default connect(
  state => ({
    project: state.app.project
  })
)(ProjectPage)
