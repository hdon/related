import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class ProjectPage extends React.Component {
  render() {
    return <div className="container">
      <h1>Project "{this.props.project.name}"</h1>
      <Row>
        <Col xs={12} sm={12} md={6} lg={4}>
          <p>
            Each project is composed of entities, and each entity in a
            project is related to each other entity by a degree which is
            determined stochastically and subjectively by the relatedness
            data you enter.
          </p>
        </Col>
        <Col xs={12} sm={12} md={6} lg={4}>
          <ul>
            <li>
              <LinkContainer to={`/projects/${this.props.project.id}/input`}>
                <a>Enter relatedness data</a>
              </LinkContainer>
            </li>
            <li>
              <LinkContainer to={`/projects/${this.props.project.id}/entities`}>
                <a>Enter entities</a>
              </LinkContainer>
            </li>
          </ul>
        </Col>
        <Col xs={12} sm={12} md={12} lg={4}>
          TODO maybe some stats about the project
        </Col>
      </Row>
    </div>
  }
}

export default connect(
  state => ({
    project: state.app.project
  })
)(ProjectPage)
