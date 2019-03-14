import RSSModel from './model';
import RSSView from './view';
import RSSController from './controller';

export default () => {
  const model = new RSSModel();
  const view = new RSSView();
  const controller = new RSSController(view, model);
  controller.initialize();
};
