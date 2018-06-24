import path from 'path';
import { fileExists } from './utils';

const resolveOptions = ({
  extensions = ['', '.js'],
} = {}) => ({
  extensions,
});

const resolve = (filename, opts) => {
  const { extensions } = resolveOptions(opts);

  for (let ext of extensions) {
    const withExt = filename + ext;

    if (fileExists(withExt)) {
      return withExt;
    }

    const pkg = path.join(filename, 'package.json');

    if (fileExists(pkg)) {
      const { main } = require(path.resolve(pkg));
      const mainPath = path.join(filename, main);

      if (fileExists(mainPath)) {
        return mainPath;
      }
    }

    const indexWithExt = path.join(filename, 'index' + ext);

    if (fileExists(indexWithExt)) {
      return indexWithExt;
    }
  }

  return filename;
};

export default resolve
