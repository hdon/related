import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

const XMLNS = 'http://www.w3.org/2000/svg';

let IDCOUNTER = 0;

class OutputPage extends React.Component {
  constructor(props) {
    super(props);

    this.svg = null;
    this.svgW = null;
    this.svgH = null;

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
    this.pumpEntities = this.pumpEntities.bind(this);
  }
  reinitializeGraphSelf() {
    const {
      entities
    , matrix
    , entityOrdinals
    } = this.initializeGraph(this.props.entities, this.props.relateds);
    this.setState({
      matrix
    , entityOrdinals
    , entities
    , maxVc: 999
    });
  }
  initializeGraph(entities, relateds) {
    if (this.svg === null)
      console.log('whoops!') // XXX
    // map entity IDs to local ordinals
    const entityOrdinals = {};
    // TODO not very efficient
    _.each(entities, (ent, i) => entityOrdinals[ent.id] = Object.keys(entityOrdinals).length);
    // similar matrix?
    const numEntities = Object.keys(entities).length;
    /* NOTE matrix is about twice as big as it needs to be... */
    const matrix = _.map(
      _.range(0, numEntities)
    , () => Array(numEntities).fill(0)
    );
    _.each(relateds, related => {
      matrix[
        entityOrdinals[related.a]
      ][
        entityOrdinals[related.b]
      ] += related.n;
    })
    const stateEntities = _.map(entities, entity =>
      ({
        ...entity
      , x: Math.random() * this.svgW
      , y: Math.random() * this.svgH
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

  //const temp = _.map(
  //  _.range(0, entities.length)
  //, () => Array(entities.length).fill(0)
  //);
    const temp = [];

    const rad = 5;
    const rad22 = rad*rad*2;

    for (let i=0; i<entities.length; i++) {
      const a = entities[i];
      const R = matrix[i];
      for (let j=i+1; j<entities.length; j++) {
        const b = entities[j];
        const r = R[j];
        const dx = a.x-b.x;
        const dy = a.y-b.y;
        const d2 = dx*dx + dy*dy;
        const d  = Math.sqrt(d2);
        // distance considering radius
        //const dr = Math.max(d - rad*2, rad*2);
        const dr = d;
        /*
        const sd = max-r-d;
        const repel = Math.min(rad*4, 1/dr);
        temp[i][j] = sd.toExponential(2);
        const rf = 0;
        const ic = 1;
        const vx = dx/d * (repel - sd) * ic;
        const vy = dy/d * (repel - sd) * ic;
        */
        /* target distance */
        const h = (max-r+1)/(max+1)*200;
        const err = d - h;
        let vx = dx/d * err;
        let vy = dy/d * err;
        const v = Math.sqrt(vx*vx + vy*vy);
        if (v > 1) {
          const vf = 1/v;
          vx *= vf;
          vy *= vf;
        }
        temp.push(Math.sqrt(vx*vx + vy*vy));
        a.vx -= vx;
        a.vy -= vy;
        b.vx += vx;
        b.vy += vy;
      }
    }
    let maxVc = 0;
    _.each(entities, ent => {
      maxVc = Math.max(maxVc, Math.sqrt(ent.vx*ent.vx + ent.vy*ent.vy));
      ent.x = Math.min(this.svgW-rad, Math.max(rad, ent.x + ent.vx));
      ent.y = Math.min(this.svgH-rad, Math.max(rad, ent.y + ent.vy));
    })
    temp.sort();
    console.log(_.map(temp, x => x.toExponential(2)));
    return maxVc;
  }
  pumpEntities() {
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
  componentWillMount() {
    console.log('componentWillMount');
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  render() {
    /* NOTE i don't think it's very useful to use RAF as opposed to setTimeout */
    if (this.state.maxVc > 0) // XXX
    requestAnimationFrame(() => {
      /* TODO cancel on unmount? */
      this.pumpEntities();
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
            onClick={this.pumpEntities}
            style={{
              width: '100%'
            , height: '100%'
            , minHeight: '600px'
            }}
            ref={svg => {
              if (svg === null) {
                console.log('unmounted <svg> i guess');
                // NOTE on re-render, the <svg> element goes away, and we
                // get called here with null. let's not reset anything
                // here, retaining those values, assuming that when <svg>
                // comes back and we get called again, the values will
                // match. if they don't, then something caused our element
                // to resize, in which case we will just have to go around
                // another pass. beyond here, there be dragons.
                //this.svg = null;
                //this.svgW = null;
                //this.svgH = null;
              } else {
                this.svg = svg;
                const r = svg.getBoundingClientRect();
                if (this.svgW !== r.width || this.svgH !== r.height) {
                  window.FOOBAR = this;
                  if (!('id' in this))
                    this.id = IDCOUNTER++;
                  console.log(`reinitializing (${this.id}) ${r.width} !== ${this.svgW} || ${this.svgH} !== ${r.height} (${this.svgW !== r.width} || ${this.svgH !== r.height})`);
                  this.svgW = r.width;
                  this.svgH = r.height;
                  console.log(`reinitialized (${this.id}) ${r.width} != ${this.svgW} || ${this.svgH} != ${r.height}`);
                  this.reinitializeGraphSelf();
                }
              }
            }}
          >
            <rect width="100%" height="100%" fill="black" />
            {
              this.state.entities.map(ent => [<circle
                key={ent.id}
                cx={ent.x}
                cy={ent.y}
                r="5px"
                fill="yellow"
              />
              , <text
                  x={ent.x}
                  y={ent.y}
                  style={{fill:'white'}}
              >{ent.name}</text>
              ])
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
                <th></th>
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
