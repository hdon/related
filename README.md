# Related

This is a simple application that will help me take a bag of entities
(programming languages and technologies) and determine which ones are the
most /related/ to each other.

This is a simple application that mostly serves as a demonstration of
using:

## Front-end

* node
* knex
* bookshelf
* kalamata

## Back-end

* babel
* webpack
* react
* redux
* redux-thunk
* react-redux-router
* new router approach

I decided to try a new technique for handling routing on the front-end. In
the past I was using `componentDidMount()` and similar React lifecycle
events to trigger requests to the server for info to display on screen, but
I never liked that solution. This is experimental!

See `src/routes/router.js` and `src/routes/index.js` for more on that.
