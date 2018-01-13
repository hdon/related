import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

const XMLNS = 'http://www.w3.org/2000/svg';

function randomizePositions(entities, w, h) {
  _.each(entities, entity => {
    entity.x = Math.random() * w;
    entity.y = Math.random() * h;
  })
}

class OutputPage extends React.Component {
  constructor(props) {
    super(props);

    const {
      entities
    , matrix
    , entityOrdinals
    } = this.initializeGraph(props.entities, props.relateds);
    this.state = {
      matrix
    , entityOrdinals
    , entities
    , maxVc: 999
    };
    /* prebinds */
    this.svgClick = this.svgClick.bind(this);
  }
  initializeGraph(entities, relateds) {
    // map entity IDs to local ordinals
    const entityOrdinals = {};
    // TODO not very efficient
    _.each(entities, (ent, i) => entityOrdinals[ent.id] = Object.keys(entityOrdinals).length);
    // similar matrix?
    const numEntities = Object.keys(entities).length;
    console.log('numEntities=', numEntities);
    /* NOTE matrix is about twice as big as it needs to be... */
    const matrix = _.map(
      _.range(0, numEntities)
    , () => Array(numEntities).fill(0)
    );
    _.each(relateds, related => {
      console.log('related.a=', related.a);
      console.log('entityOrdinals[related.a]=', entityOrdinals[related.a]);
      console.log('related.b=', related.b);
      console.log('entityOrdinals[related.b]=', entityOrdinals[related.b]);
      matrix[
        entityOrdinals[related.a]
      ][
        entityOrdinals[related.b]
      ] += related.n;
    })
    const stateEntities = _.map(entities, entity =>
      ({
        ...entity
      , x: Math.random()
      , y: Math.random()
      , vx: 0
      , vy: 0
      })
    );
    return {
      matrix
    , entityOrdinals
    , entities: stateEntities
    };
  }
  pumpGraph(entities, matrix) {
    let max = 0;
    _.each(matrix, row => _.each(row, x => max = Math.max(x, max)));

    _.each(entities, ent => {
      ent.vx = 0;
      ent.vy = 0;
    })
    for (let i=0; i<entities.length; i++) {
      const a = entities[i];
      const R = matrix[i];
      for (let j=i+1; j<entities.length; j++) {
        const b = entities[j];
        const r = R[j];
        const dx = a.x-b.x;
        const dy = a.y-b.y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        const dd = r-(max-d)/max;
        const vx = dx * dd;
        const vy = dy * dd;
        a.vx += vx;
        a.vy += vy;
        b.vx -= vx;
        b.vy -= vy;
      }
    }
    let maxVc = 0;
    _.each(entities, ent => {
      maxVc = Math.max(maxVc, Math.sqrt(ent.vx*ent.vx + ent.vy*ent.vy));
      ent.x = Math.min(0.9, Math.max(0.1, ent.x + ent.vx * 0.01));
      ent.y = Math.min(0.9, Math.max(0.1, ent.y + ent.vy * 0.01));
    })
    return maxVc;
  }
  svgClick(ev) {
    const entities = _.map(this.state.entities, ent => ({ ...ent }));
    const maxVc = this.pumpGraph(entities, this.state.matrix);
    this.setState({
      entities
    , maxVc
    });
  }
  recalculateNodeDimensions(entities) {
    const entityDims = {}
    
    _.each(entities, entity => {
      const elem = document.createElementNS(XMLNS, 'text');
      elem.textContent = entity.name;
      this.svg.appendChild(elem);
      const bbox = elem.getBBox();
      entityDims[entity.name] = {
        width: bbox.width
      , height: bbox.height
      }
      this.svg.removeChild(elem);
    });

    return entityDims;
  }
  componentWillReceiveProps(props) {
    const {
      entities
    , matrix
    , entityOrdinals
    } = this.initializeGraph(props.entities, props.relateds);
    this.setState({
      matrix
    , entityOrdinals
    , entities
    })
  }
  matrixGet(idA, idB) {
    if (idB < idA) {
      const x = idB;
      idB = idA;
      idA = x;
    }
    const i = this.state.entityOrdinals;
    const m = this.state.matrix;
    return m[i[idA]][i[idB]];
  }
  render() {
    /* NOTE i don't think it's very useful to use RAF as opposed to setTimeout */
    console.log('maxVc:', this.state.maxVc);
    if (this.state.maxVc > 0)
    requestAnimationFrame(() => {
      /* TODO cancel on unmount? */
      this.svgClick();
    });
    return <div className="container">
      <Row>
        <h1>Project "{this.props.project.name}" Output</h1>
        <Col lg={4} md={4} sm={12} xs={12}>
          <ul>
            {
              this.props.relateds.map(related => <li
                key={`${related.a}-${related.b}`}
                >
                {
                  this.props.entities[related.a].name
                + ' '
                + this.props.entities[related.b].name
                }
              </li>)
            }
          </ul>
        </Col>
        <Col lg={8} md={8} sm={12} xs={12}>
          <svg
            onClick={this.svgClick}
            style={{
              width: '100%'
            , height: '100%'
            , minHeight: '600px'
            }}
            ref={svg => this.svg = svg}
          >
            <rect width="100%" height="100%" fill="black" />
            {
              this.state.entities.map(ent => <circle
                key={ent.id}
                cx={100*ent.x+'%'}
                cy={100*ent.y+'%'}
                r="2.5%"
                fill="yellow"
              />)
            }
          </svg>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <h2>Matrix</h2>
          <table>
            <thead>
              <tr>
                {
                  _.map(this.props.entities, (ent, k) =>
                    <th key={k}>{ent.name}</th>
                  )
                }
              </tr>
            </thead>
            <tbody>
              {
                _.map(this.props.entities, (a, ak) => <tr key={ak}>
                    <th>{a.name}</th>
                    {
                      _.map(this.props.entities, (b, bk) =>
                        <td key={bk}>{this.matrixGet(a.id, b.id)}</td>
                      )
                    }
                  </tr>
                )
              }
            </tbody>
          </table>
        </Col>
      </Row>
    </div>
  }
}

export default connect(
  state => ({
    project: state.app.project
  , entities: _.keyBy(state.app.entities, 'id')
  , relateds: state.app.relateds
  })
)(OutputPage)
