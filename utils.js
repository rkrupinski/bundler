import fs from 'fs';
import path from 'path';

export const compose = (...fns) => arg =>
    fns.reduceRight((acc, curr) => curr(acc), arg);

export const isRelative = url => /^\.{0,2}\//.test(url);

export const fileExists = url => {
  const absoluteUrl = path.resolve(url);

  return fs.existsSync(absoluteUrl) && fs.statSync(absoluteUrl).isFile();
};
