import fs from 'fs';
import { parse } from '@babel/parser';
import { transformFromAst } from '@babel/core';
import traverse from '@babel/traverse';

import resolve from './resolve';
import { file } from '@babel/types';

const createAssetOptions = ({
  dontTranspile = [/^node_modules/],
} = {}) => ({
  dontTranspile,
});

let ID = 0;

const createAsset = (filename, opts) => {
  const resolved = resolve(filename);
  const { dontTranspile } = createAssetOptions(opts);
  const transpile = !dontTranspile.some(pattern => pattern.test(filename));

  const content = fs.readFileSync(resolved, 'utf-8');

  const id = ID++;
  const dependencies = [];
  let code = content;

  if (transpile) {
    const ast = parse(content, { sourceType: 'module' });

    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      },
    });

    code = transformFromAst(ast, null, {
      presets: [
        ['@babel/preset-env', { modules: false }],
      ],
      plugins: ['transform-es2015-modules-commonjs'],
    }).code;
  }

  return {
    id,
    code,
    dependencies,
    filename: resolved,
  };
};

export default createAsset
