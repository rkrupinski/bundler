import path from 'path';

import createAsset from './asset';
import { isRelative } from './utils';

const createGraph = (entry) => {
  const mainAsset = createAsset(entry);

  const queue = [mainAsset];

  for (const asset of queue) {
    asset.mapping = {};

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(
        isRelative(relativePath)
            ? path.dirname(asset.filename)
            : 'node_modules',
        relativePath,
      );

      const child = createAsset(absolutePath);

      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }

  return queue;
};

export default createGraph
