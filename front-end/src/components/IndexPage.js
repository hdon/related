import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import * as moment from 'moment';

const githubEvent = ghev => <Row key={ghev.id}>
  <Col xs={12} sm={2} md={1} lg={1}>
    <p className="text-center">
    <img width="100%" style={{maxWidth:"25vw"}} src={ghev.actor.avatar_url}/>
    </p>
  </Col>
  <Col xs={12} sm={10} md={11} lg={11}>
  {ghev.actor.display_login+' '}
  pushed {ghev.payload.commits.length} commits to {' '}
  <a href={ghev.repo.url}>{ghev.repo.name}</a>
  {' at '}
  {moment(ghev.created_at).format('lll')}
  {
    ghev.payload.commits.map(com => <p key={com.id}>
      <pre>{com.message}</pre>
    </p>)
  }
  </Col>
</Row>
;

/* TODO i don't feel like reading github's docs, i just wanted to slap
 * this thing onto this app for fun...
 */
const tryGithubEvent = ghev => {
  try { return githubEvent(ghev) }
  catch (e) { console.error(e) }
  return null;
}

class IndexPage extends React.Component {
  render() {
    return <Grid>
      <Row>
        <Jumbotron>
          <h1>Related</h1>
          <p>
            This simple app makes it easy to develop graphs (perhaps better
            known as "webs") of related entities, when you aren't really
            sure which items should be connected to which!
          </p>
          <p>
            Create a new project to get started!
          </p>
          <p>
            <Button bsStyle="primary">Create Project</Button>
          </p>
        </Jumbotron>
      </Row>
      {
        this.props.githubEvents.map(tryGithubEvent)
      }
    </Grid>
  }
}

export default connect(
  state => ({
    githubEvents: state.app.githubEvents
  })
)(IndexPage)
