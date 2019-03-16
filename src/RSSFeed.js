import StateMachine from 'javascript-state-machine';
import axios from 'axios';

export default class RSSFeed {
  constructor(uri) {
    this.uri = uri;
    this.title = null;
    this.description = null;
    this.items = [];
    this._fsm(); // eslint-disable-line
  }

  addItems(newItems) {
    this.items = [...newItems, ...this.items];
  }
}

StateMachine.factory(RSSFeed, {
  init: 'init',
  transitions: [
    { name: 'add', from: 'init', to: 'pending' },
    { name: 'request', from: 'pending', to: 'requested' },
    { name: 'complete', from: 'requested', to: 'completed' },
    { name: 'update', form: 'completed', to: 'pending' },
    { name: 'cancel', from: ['pending', 'requested'], to: 'canceled' },
  ],
  methods: {
    onRequest: (lifecycle) => {
      const currentFeed = lifecycle.fsm;
      const corsProxyPrefix = 'https://yacdn.org/proxy/';
      return axios.get(`${corsProxyPrefix}${currentFeed.uri}`);
    },
  },
});
