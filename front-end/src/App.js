import React from 'react';
import { Navbar, Nav, NavItem, Jumbotron, Button, Grid, Row } from 'react-bootstrap';
import './App.css';
import { Route, Switch } from 'react-router';
import IndexPage from './components/IndexPage';
import { LinkContainer } from 'react-router-bootstrap';

const ProjectPage = () =>
  <h1>Projects!</h1>

class App extends React.Component {
  render() {
    return <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to="/">
              <a>Related</a>
            </LinkContainer>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <LinkContainer to="/projects">
            <NavItem>Projects</NavItem>
          </LinkContainer>
          <LinkContainer to="/input">
            <NavItem>Input</NavItem>
          </LinkContainer>
          <NavItem href="#">Output</NavItem>
        </Nav>
      </Navbar>
      <Switch>
        <Route path="/" exact={true} component={IndexPage}/>
        <Route path="/projects" exact={true} component={ProjectPage}/>
      </Switch>
    </div>
  }
}

export default App;
