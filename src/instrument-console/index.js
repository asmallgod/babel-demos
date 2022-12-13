const { transformFileSync } = require('@babel/core');
const insertParametersPlugin = require('./plugin');
const path = require('path');

const { code } = transformFileSync(path.join(__dirname, './code.js'), {
  plugins: [insertParametersPlugin],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx']
  }
});

console.log(code);
