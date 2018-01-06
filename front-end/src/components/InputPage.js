import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';
import {
  fetchComparands
, sendComparison
} from '../actions';

const defaultComparands = [
  {name: '...'}
, {name: '...'}
, {name: '...'}
];

class InputPage extends React.Component {
  constructor(props) {
    super(props);
  }
  /* just returns a bound function */
  submit(which=null) {
    return () => {
      /* TODO create a single HTTP endpoint that accomplishes both? :) */
      if (which !== null) {
        this.props.actions.sendComparison(
          this.props.comparands[0].id
        , which
        );
      }
      this.props.actions.fetchComparands(this.props.project.id);
    }
  }
  render() {
    const comparands = this.props.comparands || defaultComparands;
    console.log('comparands=', comparands);
    const spinning = this.props.spinning;
    return <div className="container">
      <h1>Project "{this.props.project.name}" Input</h1>
      <Row>
        <h2 className="text-center featured-entity">{comparands[0].name}</h2>
      </Row>
      <Row>
        <h2 className="text-center">...is more related to...</h2>
      </Row>
      <Row>
        <Col xs={12} lg={6} md={6} sm={6}>
          <Button
            bsSize="lg"
            className="center-block"
            bsStyle="success"
            disabled={spinning}
            onClick={this.submit(comparands[1].id)}
          >
            {comparands[1].name}
          </Button>
        </Col>
        <Col xs={12} lg={6} md={6} sm={6}>
          <Button
            bsSize="lg"
            className="center-block"
            bsStyle="success"
            disabled={spinning}
            onClick={this.submit(comparands[2].id)}
          >
            {comparands[2].name}
          </Button>
        </Col>
      </Row>
      <Row>
        <Button
          className="center-block"
          bsSize="lg"
          bsStyle="danger"
          disabled={spinning}
          onClick={this.submit(null)}
        >Neither</Button>
      </Row>
    </div>
  }
}

export default connect(
  state => ({
    project: state.app.project
  , comparands: state.app.comparands
  , spinning: state.app.spinning
  })
, dispatch => ({
    actions: bindActionCreators({
      fetchComparands
    , sendComparison
    }, dispatch)
  })
)(InputPage);
