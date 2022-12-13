const { default: generate } = require('@babel/generator');
const { default: template } = require('@babel/template');
const types = require('@babel/types');

const targetCalleeName = ['log', 'error', 'info', 'debug'].map(item => `console.${item}`);
module.exports = function(api, options) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew) {
          return;
        }
        const calleeName = generate(path.node.callee).code;
        if (targetCalleeName.includes(calleeName)) {
          const { line, column } = path.node.loc.start;
          const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();
          newNode.isNew = true;
          if (path.findParent(path => path.isJSXElement())) {
            path.replaceWith(types.arrayExpression([newNode, path.node]));
            path.skip();
          } else {
            path.insertBefore(newNode);
          }
        }
      }
    }
  };
};
