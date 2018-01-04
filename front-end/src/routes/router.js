/* Right now this is a very basic router that only supports entering an
 * specific route. Parameters are supported, and handlers are "enter"
 * handlers, anticipating that "leave" handlers may be added.
 *
 * Routes should be familiar to users of express and react-router. For
 * example:
 *
 * /projects
 * /projects/:project_id
 *
 * My motivation for this is that I don't like the way I've been
 * integrating redux and react with respect to loading new data when the
 * user navigates to a new "page." When a component appears that needs to
 * resolve its data asynchronously, I was using componentDidMount() and
 * other silly react component lifecycle events to trigger requests to the
 * server and ultimately dispatch the results to the store.
 *
 * I can already see that this approach will violate the DRY principle
 * because routes will need to be expressed in two places (once for
 * react-router and once for this Router) but maybe I'll come up with an
 * idea for resolving that later.
 *
 * TODO pre-split req.path to save a little time
 * TODO index handlers to avoid linear search?
 */

class Router {
  constructor() {
    this.handlers = [];
  }
  /* function signature: (req, next)
   * fn should call next() when it is finished handling the request if
   * further request processing is desired. similar to express.
   */
  use(fn) {
    this.handlers.push(fn)
  }
  /* fn has same function signature as fn argument to use(), but your
   * handler will be skipped unless req.type == 'enter' and your path
   * matches. path parameters like /projects/:project_id are supported,
   * similar to express and react-router
   */
  enter(routePath, fn) {
    const routePathComponents = routePath.split('/');
    this.use((req, next) => {
      if (req.type != 'enter')
        return void next();
      const reqPathComponents = req.path.split('/');
      if (reqPathComponents.length != routePathComponents.length)
        return void next();
      let params = {};
      for (let i=0; i<reqPathComponents.length; i++) {
        let reqPathComponent = reqPathComponents[i];
        let routePathComponent = routePathComponents[i];
        if (routePathComponent.length && routePathComponent[0] == ':') {
          let paramName = routePathComponent.substr(1);
          params[paramName] = reqPathComponent;
        } else {
          if (reqPathComponent != routePathComponent)
            return void next();
        }
      }
      fn({ ...req, params }, next);
    })
  }
  /* Evaluate routes */
  route(path) {
    const req = { type: 'enter', path };
    let iHandler = 0;
    const next = () => {
      console.log('router trying handler', iHandler, '/', this.handlers.length);
      if (iHandler < this.handlers.length)
        this.handlers[iHandler++](req, next);
      else
        this.notFound(req);
    }
    next();
  }
  /* Default notFound handler */
  notFound(req) {
    console.log(`route for location ${req.path} not found`);
  }
}

export default Router;
