const renderer = require('../support/renderer');

describe('configmap', () => {
  it('should work', async () => {
    const template = `
      {{- include "libchart.configmap" (list . "mychart.configmap") -}}
      {{- define "mychart.configmap" -}}
      metadata:
        name: {{ .Values.name }}
      data:
        myvalue: {{ .Values.property }}
      {{- end -}}
    `;
    const values = `
      global:
        color: yellow

      name: test-config
      property: value
    `;

    const result = await renderer.render(template, values);

    const expected = `
      apiVersion: v1
      kind: ConfigMap
      metadata:
        annotations:
          libchart.io/color: yellow
        name: test-config
      data:
        myvalue: value
    `;

    expect(result).toMatchYAML(expected);
  });
});
