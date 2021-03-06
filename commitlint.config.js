module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'React', 'React Native', 'SDK',
      'DataTable'
    ]],
    'scope-case': [0],
    'references-empty': [1, 'never'],
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'WIP'
    ]],
    'type-case': [0]
  }
};
