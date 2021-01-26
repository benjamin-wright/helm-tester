const fs = require('fs').promises;
const childProcess = require('child_process');
const YAML = require('yaml');

const templatePath = './test-chart/templates/test.template.yaml';
const valuesPath = './test-chart/values.yaml';

module.exports = {
  render
}

async function render(template, values) {
  template = unindent(template);
  values = unindent(values);

  await fs.writeFile(templatePath, template);
  await fs.writeFile(valuesPath, values);

  const output = await run('helm template ./test-chart');
  return YAML.parseAllDocuments(output).map(x => x.toJSON());
}

function run(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      resolve(stdout);
    });
  });
}

function unindent(template) {
  const lines = template.split('\n');

  const spaces = lines.reduce((previous, line) => Math.min(previous, numSpaces(line)), Number.MAX_VALUE);
  return lines.map(line => line.substring(spaces)).join('\n');
}

function numSpaces(line) {
  for (let i = 0; i < line.length; i++) {
    const char = line.charAt(i);
    if (char !== ' ') {
      return i
    }
  }

  return Number.MAX_VALUE;
}