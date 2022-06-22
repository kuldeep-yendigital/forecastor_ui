/* global describe, it, expect, PLATFORM, afterEach, beforeEach, jasmine, spyOn, window */
import { Authorizer } from './authorizer';

class FakeNavigationInstruction {
  constructor() {
    this.allInstructions = [];
  }

  setInstructions(instructions) {
    this.allInstructions = instructions;
  }

  getAllInstructions() {
    return this.allInstructions;
  }
}

describe('Authorizer', () => {

  let authorizer;

  describe('Not Authorized', () => {
    const NOT_AUTHORIZED_CONTEXT = {};

    beforeEach(() => {
      authorizer = new Authorizer(() => false, () => NOT_AUTHORIZED_CONTEXT);
    });

    it('continues if route has no instructions', () => {
      const context = {};

      const nextContext = authorizer.run(new FakeNavigationInstruction(), () => context);

      expect(nextContext).toEqual(context);
    });

    it('continues if route authorization is not required', () => {
      const context = {};
      const navigationInstruction = new FakeNavigationInstruction();
      navigationInstruction.setInstructions([
        {config: { settings: { auth: false } } }
      ]);

      const nextContext = authorizer.run(navigationInstruction, () => context);

      expect(nextContext).toEqual(context);
    });

    it('cancels if route authorization is required and user is not authenticated', () => {
      const navigationInstruction = new FakeNavigationInstruction();
      navigationInstruction.setInstructions([
        {config: { settings: { auth: true } } }
      ]);

      const context = authorizer.run(navigationInstruction, { cancel: c => c });

      expect(context).toEqual(NOT_AUTHORIZED_CONTEXT);
    });
  });

  describe('Is Authorized', () => {
    beforeEach(() => {
      authorizer = new Authorizer(() => {
        return {
          isValid: true
        };
      });
    });

    it('continues if route authorization is required and user is authenticated', () => {
      const context = {};

      const navigationInstruction = new FakeNavigationInstruction();
      navigationInstruction.setInstructions([
        {config: { settings: { auth: true } } }
      ]);

      const nextContext = authorizer.run(navigationInstruction, () => context);

      expect(nextContext).toEqual(context);
    });
  });
});
