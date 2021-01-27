const fs = require('fs').promises;
const childProcess = require('child_process');
const YAML = require('yaml');
const faker = require('faker');

const scratchDir = '/tmp/helm-test';
const templatePath = 'templates/test.template.yaml';
const valuesPath = 'values.yaml';
const testChartPath = process.env['TEST_CHART'];

module.exports = {
  render
}

async function render(template, values) {
  if (!testChartPath) {
    throw new Error('TEST_CHART not defined');
  }

  template = unindent(template);
  values = unindent(values);
  const path = faker.random.uuid();

  await createChart(scratchDir, path);
  await copyChart(`${scratchDir}/${path}`, testChartPath);

  await fs.writeFile(`${scratchDir}/${path}/${templatePath}`, template);
  await fs.writeFile(`${scratchDir}/${path}/${valuesPath}`, values);

  const output = await run(`helm template ${scratchDir}/${path}`);

  await run(`rm -rf ${scratchDir}/${path}`);

  return YAML.parseAllDocuments(output).map(x => x.toJSON());
}

async function createChart(scratch, path) {
  await run([
    `mkdir -p ${scratch}`,
    `cd ${scratch}`,
    `helm create ${path}`,
    `cd ${path}`,
    'rm -rf templates',
    'mkdir templates'
  ].join(' && '));
}

async function copyChart(path, testChart) {
  await run(`cp -r ${testChart} ${path}/charts/lib-chart`);
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