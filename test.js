import bundle from './bundler';
import createGraph from './graph';
import { compose } from './utils';

const bundler = compose(bundle, createGraph);

process.stdout.write(bundler('./example/entry'));
