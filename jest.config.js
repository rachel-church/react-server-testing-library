const kcdJestConfig = require('kcd-scripts/dist/config/jest.config')

const jestConfig = {
    ...kcdJestConfig,
    testEnvironment: 'node',
}

module.exports = jestConfig
