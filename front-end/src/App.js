import React from 'react';
import { Navbar, Nav, NavItem, Jumbotron, Button, Grid, Row } from 'react-bootstrap';
import './App.css';
import { Route, Switch } from 'react-router';
import IndexPage from './components/IndexPage';
import ProjectsPage from './components/ProjectsPage';
import NewProjectPage from './components/NewProjectPage';
import ProjectPage from './components/ProjectPage';
import InputPage from './components/InputPage';
import { LinkContainer } from 'react-router-bootstrap';

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
        </Nav>
      </Navbar>
      <Switch>
        <Route path="/" exact component={IndexPage}/>
        <Route path="/projects/new" exact component={NewProjectPage}/>
        <Route path="/projects" exact component={ProjectsPage}/>
        <Route path="/projects/:project_id" exact component={ProjectPage}/>
        <Route path="/projects/:project_id/input" exact component={InputPage}/>
      </Switch>
    </div>
  }
}

export default App;
