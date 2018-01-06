import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class ProjectsPage extends React.Component {
  render() {
    return <div className="container">
      <h1>Projects</h1>
      <Row>
        <p>
          <LinkContainer to="/projects/new">
            <Button>Create Project</Button>
          </LinkContainer>
        </p>
      </Row>
      {
        this.props.projects.length
      ? this.props.projects.map(project => <Row>
          <ul>
            <LinkContainer to={'/projects/'+project.id}>
              <a>{project.name}</a>
            </LinkContainer>
          </ul>
        </Row>)
      : <Row>
          <p>
            Looks like you don't have any projects. Why don't you
            {' '}
            <LinkContainer to="/projects/new">
              <a>create one</a>
            </LinkContainer>
            ?
          </p>
        </Row>
      }
    </div>
  }
}

export default connect(
  state => ({
    projects: state.app.projects
  })
)(ProjectsPage);
