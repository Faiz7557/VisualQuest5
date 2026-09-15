const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ComposedChart, Area, XAxis, YAxis } = require('recharts');

const data = [
  { t: '2024-10', v: 40, band: null },
  { t: '2024-11', v: 45, band: null },
  { t: '2024-12', v: 50, band: [50, 50] },
  { t: '2025-01', v: 55, band: [52, 58] },
  { t: '2025-02', v: 60, band: [54, 66] }
];

const element = React.createElement(
  ComposedChart,
  { width: 500, height: 300, data: data },
  React.createElement(XAxis, { dataKey: 't' }),
  React.createElement(YAxis),
  React.createElement(Area, { dataKey: 'band', fill: '#f97316', stroke: 'none', connectNulls: true, isAnimationActive: false })
);

try {
  const html = ReactDOMServer.renderToString(element);
  console.log('HTML length:', html.length);
  const hasPath = html.includes('recharts-area-area');
  console.log('Has recharts-area-area path:', hasPath);
  const dIdx = html.indexOf('class="recharts-curve recharts-area-area"');
  if (dIdx !== -1) {
    const snippet = html.substring(dIdx - 20, dIdx + 120);
    console.log('Snippet:', snippet);
  }
} catch (e) {
  console.error('Error:', e);
}
