const { readFileSync } = require('fs');
const { dirname, join } = require('path');
const { parse } = require('@babel/parser');
const { transformFromAst } = require('@babel/core');
const traverse = require('@babel/traverse').default;

let ID = 0;

export const createAsset = (filename) => {
  const content = readFileSync(filename, 'utf-8');

  const ast = parse(content, { sourceType: 'module' });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const id = ID++;

  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };
};
