import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Grid
, Row
, Col
, Button
, FormControl
, ControlLabel
, Form
, FormGroup
, ListGroup
, ListGroupItem
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {
  deleteEntity
, addEntity
} from '../actions';

class EntitiesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }
  deleteEntity(id, ev) {
    ev.preventDefault();
    this.props.deleteEntity(id);
  }
  addEntity(ev) {
    ev.preventDefault();
    this.props.addEntity(this.state.value, this.props.project.id);
    this.setState({
      value: ''
    })
  }
  onChange(ev) {
    this.setState({
      value: ev.target.value
    })
  }

  render() {
    return <div className="container">
      <h1>Project "{this.props.project.name}"</h1>
      <Row>
        <Col lg={4} md={4} sm={12} xs={12}>
          <h2>Add Entities</h2>
          <p>
            In order to begin inputting relatedness data, a project first
            requires at least three entities.
          </p>
          <p>
            Of course, if you need help creating a map of three entities,
            you are in the wrong place....
          </p>
          <Form onSubmit={this.addEntity.bind(this)}>
            <FormGroup controlId="newEntityName">
              <ControlLabel>New Entity Name</ControlLabel>
              <FormControl
                type="text"
                name="newEntityName"
                placeholder="Entity Name"
                value={this.state.value}
                onChange={this.onChange.bind(this)}
              />
            </FormGroup>
            <Button type="submit" bsStyle="success">
              Add Entity
            </Button>
          </Form>
        </Col>
        <Col lg={4} md={4} sm={12} xs={12}>
          <h2>Delete Entities</h2>
          {
            this.props.entities
          ? <ListGroup>
              {this.props.entities.map(entity =>
                  <ListGroupItem
                    key={entity.id}
                    onClick={this.deleteEntity.bind(this, entity.id)}
                  >
                    {entity.name}
                  </ListGroupItem>
              )}
            </ListGroup>
          : <p>Loading entities...</p>
          }
        </Col>
        <Col lg={4} md={4} sm={12} xs={12}>
          <h2>Relatedness</h2>
            <LinkContainer to={`/projects/${this.props.project.id}/input`}>
              <a>Enter relatedness data</a>
            </LinkContainer>
        </Col>
      </Row>
    </div>
  }
}

export default connect(
  state => ({
    project: state.app.project
  , entities: state.app.entities
  })
, dispatch => bindActionCreators({
    deleteEntity
  , addEntity
  }, dispatch)
)(EntitiesPage)
