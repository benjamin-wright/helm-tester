const YAML = require('yaml');

expect.extend({
  toMatchYAML(received, expected) {
    const expectedObj = YAML.parseAllDocuments(expected).map(x => x.toJSON());

    try {
      expect(received).toEqual(expectedObj);
      return {
        pass: true,
        message: () => `Expected rendered output not to match ${expected}`
      }
    } catch (err) {
      return {
        pass: false,
        message: () => `Expected rendered output to match: ${err.message}`
      }
    }
  }
});