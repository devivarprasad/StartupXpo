// Husky configuration for pre-commit hooks
module.exports = {
  hooks: {
    'pre-commit': 'npm run lint && npm run format'
  }
};
