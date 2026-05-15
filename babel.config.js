```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { browsers: ['>= browserslist@1.53.0'] } }],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime'
  ]
};
```