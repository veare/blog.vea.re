import contentful from './services/contentful'
import config from './config/contentful'
import makeApp from './app'
const http = require('http')
const env = process.env.NODE_ENV || 'development'
const online = require('dns-sync').resolve(config.host[env])

const startServer = async () => {
  const app = await makeApp()
  // ------------------------
  // development server
  // ------------------------
  if (env === 'development') {
    console.info('\u001b[36m############################ Reloaded ############################\u001b[0m')
    console.info('Environment: ' + process.env.NODE_ENV)
    console.info('✅ Listening on http://localhost:8080')
    // app.listen('8080')
    http.createServer(app).listen('8080')
  // ------------------------
  // TEST server
  // ------------------------
  } else if (env === 'test') {
    // app.listen('3300')
    http.createServer(app).listen('3300')
  // ------------------------
  // live server server
  // ------------------------
  } else {
    require('greenlock-express')
      .init({
        // path.join(__dirname, '/../')
        packageRoot: require('path').join(__dirname, '/../'),
        // contact for security and critical bug notices
        maintainerEmail: 'oppermann.lukas@gmail.com',
        // where to look for configuration
        // config file is uploded here via capistrano from config/greenlock-config.json
        configDir: './../../shared/greenlock.d',
        // whether or not to run at cloudscale
        cluster: false
      })
      // Serves on 80 and 443
      // Get's SSL certificates magically!
      .serve(app)
  }
}

try {
  if (online !== null) {
    // get content from contentful & run transformers
    contentful()
    // start server
      .then(() => startServer())
  } else {
    startServer()
  }
} catch (error) {
  // catch & print error
  console.error(`🚨 \x1b[31mError: ${error.code} when trying to connect to ${error.hostname}\x1b[0m`, error)
  console.error(error)
  // try to start server anyway
  startServer()
}
