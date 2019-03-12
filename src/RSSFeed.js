import StateMachine from 'javascript-state-machine';
import axios from 'axios';

export default class RSSFeed {
  constructor(uri) {
    this.uri = uri;
    this.title = null;
    this.description = null;
    this.items = null;
    this._fsm(); // eslint-disable-line
  }
}

StateMachine.factory(RSSFeed, {
  init: 'init',
  transitions: [
    { name: 'add', from: 'init', to: 'pending' },
    { name: 'request', from: 'pending', to: 'requested' },
    { name: 'complete', from: 'requested', to: 'completed' },
    { name: 'cancel', from: ['pending', 'requested'], to: 'canceled' },
  ],
  methods: {
    onRequest: (lifecycle) => {
      const currentFeed = lifecycle.fsm;
      const corsProxyPrefix = 'https://cors-anywhere.herokuapp.com/';
      return axios.get(`${corsProxyPrefix}${currentFeed.uri}`);
    },
  },
});
