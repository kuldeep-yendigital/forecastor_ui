export class Authorizer {
  constructor(dataFunc, onNotAuthenticated) {
    this.getData = dataFunc;
    this.onNotAuthenticated = onNotAuthenticated;
  }

  run(navigationInstruction, next) {
    const user = this.getData();
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      if (!user.isValid) {
        return next.cancel(this.onNotAuthenticated());
      }
    }
    return next();
  }
}
