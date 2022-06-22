const LEVELS = ['info', 'warn', 'error'];

class Logger {
  constructor(name, loggerService) {
    LEVELS.forEach(level => {
      this[level] = (...args) => { loggerService[level](`[${name}]`, ...args) };
    });
  }
}

/**
 * Creates logging output, be sparing this will eventually go across
 * the wire. Each log line will be serialized as a single string and
 * needs to be independently useful.
 */
export class LoggerService {

  static inject() {
    return ['config'];
  }

  constructor(config) {
    const logLevel = config.get ? config.get('logLevel') : 'error';

    LEVELS.forEach(level => {
      if (LEVELS.indexOf(logLevel) <= LEVELS.indexOf(level)) {
        this[level] = (...args) => { console[level](args.map(arg => {
          return typeof arg === 'string' ? arg : JSON.stringify(arg);
        }).join(' ')); };
      } else {
        this[level] = () => {};
      }
    });
  }

  createLogger(name) {
    return new Logger(name, this);
  }
}
