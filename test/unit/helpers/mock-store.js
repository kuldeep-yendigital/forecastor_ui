import Store from '../../../src/stores/store';
import { EventAggregator} from "aurelia-event-aggregator";


export const BindingEngineMock = {
  propertyObserver: () => {
    return {
      subscribe: ()=> {
      }
    }
  }
};
export const EventAggregatorMock = {
  subscribe: ()=> {
  }
};
export const GenericServiceMock = {};






export default class MockStore extends Store {
  
  constructor(mocks, dataProp) {
    if(mocks) {
      console.log(mocks)
    }
    super(BindingEngineMock, EventAggregatorMock, GenericServiceMock);
    this.data = dataProp;
  }
  
  get EVENTS() {
    return [];
  }

  getDefaultState() {
    return null;
  }
}
