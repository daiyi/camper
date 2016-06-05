var winston = require('winston');
var transports = [];
var defaultTransports = [
  new winston.transports.File({
    prettyPrint: false,
    name: 'error-file',
    timestamp: true,
    filename: 'scraper.error.log',
    level: 'error'
  }),
  new winston.transports.File({
    prettyPrint: false,
    name: 'debug-file',
    filename: 'scraper.debug.log',
    level: 'debug'
  })
]
transports = transports.concat(defaultTransports)
switch (process.env.NODE_ENV) {
  case 'dev':
    var devTransports = [
      new winston.transports.Console({
        prettyPrint: true,
        handleExceptions: true,
        colorize: true
      })
    ]
    transports = transports.concat(devTransports)
    break;
  default:
    //noop
}
var logger = new (winston.Logger)({
  levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
  },
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  },
  exitOnError: false,
  transports: transports});

module.exports=logger;
