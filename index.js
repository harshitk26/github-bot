var Set = require("collections/set");


/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')
  var contributors = new Set();

  app.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    return context.github.issues.createComment(issueComment)
  })

  app.on('push', async context => {
    // Code was pushed to the repo, what should we do with it?
    const payload = context.payload
    contributors.add(payload.pusher.name)
    app.log('Committed by --- ', payload.pusher.name)
  })

  // Get an express router to expose new HTTP endpoints
  const router = app.route('/github')

  // Use any middleware
  router.use(require('express').static('public'))

  // Add a new route
  router.get('/contributor', (req, res) => {
    // res.send('Hello World')
    for (var user of contributors) {
        res.write(user+'\n');
    }
    res.send()
  })

  app.route().get('/hello-world', (req, res) => {
    req.log('Someone is saying hello')
    for (var user of contributors) {
        console.log(user+' iterated');
    }
  })
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
