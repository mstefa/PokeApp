const common = [
  '--require-module ts-node/register',
  '--require-module tsconfig-paths/register'
];

const backend = [
  ...common,
  'tests/features/*.feature',
  '--require tests/step_definitions/*.steps.ts'
].join(' ');

module.exports = {
  backend
};
