const bundle = (graph) => {
  const modules = graph.reduce((acc, mod) => acc + `${mod.id}: [
    function (require, module, exports) {
      ${mod.code}
    },
    ${JSON.stringify(mod.mapping)},
  ],`, '');

  return `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports : {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    }({${modules}}));
  `;
}

export default bundle;
