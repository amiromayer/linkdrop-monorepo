const myWebpackConfig = require('../webpack.config.js')

module.exports = ({ config }) => {
  console.log(config.resolve)
  return {
    ...config,
    resolve: {
      ...config.resolve,
      extensions: ['.js', '.jsx', '.json', '.scss', '.css', '*'],
      modules: [
        ...(config.resolve.modules || []),
        ...(myWebpackConfig.resolve.modules || [])
      ],
      alias: {
        ...(config.resolve.alias || {}),
        ...(myWebpackConfig.resolve.alias || {})
      }
    },
    module: {
      rules: [
        ...((myWebpackConfig.module || {}).rules || [])
      ]
    }
  }
}
