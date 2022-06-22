export class FakeLoggerService {
  createLogger() {
    return {
      error          : () => {},
      group          : () => {},
      groupEnd       : () => {},
      groupCollapsed : () => {},
      info           : () => {},
      warn           : () => {}
    }
  }
}
