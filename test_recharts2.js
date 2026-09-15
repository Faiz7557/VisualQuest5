const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ComposedChart, Area, Line, XAxis, YAxis } = require('recharts');
const fs = require('fs');

const hist = JSON.parse(fs.readFileSync('public/data/historical_timeseries.json', 'utf-8'));
const proj = JSON.parse(fs.readFileSync('public/data/forecast_projection.json', 'utf-8'));

const lastH = hist[hist.length - 1];

const chartData = [
  ...hist.map(h => ({
    tanggal: h.tanggal.slice(0, 7),
    vol: h.volume_konsultasi_mental,
    proyeksi: null,
    ci95: null,
    ci68: null
  })),
  {
    tanggal: lastH.tanggal.slice(0, 7),
    vol: lastH.volume_konsultasi_mental,
    proyeksi: lastH.volume_konsultasi_mental,
    ci95: [lastH.volume_konsultasi_mental, lastH.volume_konsultasi_mental],
    ci68: [lastH.volume_konsultasi_mental, lastH.volume_konsultasi_mental]
  },
  ...proj.map(p => ({
    tanggal: p.tanggal.slice(0, 7),
    vol: null,
    proyeksi: Math.round(p.proyeksi_volume),
    ci95: [Math.round(p.ci95_bawah), Math.round(p.ci95_atas)],
    ci68: [Math.round(p.ci68_bawah), Math.round(p.ci68_atas)]
  }))
];

console.log('Total points:', chartData.length);

const element = React.createElement(
  ComposedChart,
  { width: 800, height: 400, data: chartData },
  React.createElement(XAxis, { dataKey: 'tanggal' }),
  React.createElement(YAxis),
  React.createElement(Area, {
    dataKey: 'ci95',
    fill: 'rgba(249, 115, 22, 0.25)',
    stroke: '#f97316',
    strokeDasharray: '4 4',
    strokeWidth: 1,
    strokeOpacity: 0.5,
    connectNulls: true,
    isAnimationActive: false
  }),
  React.createElement(Area, {
    dataKey: 'ci68',
    fill: 'rgba(249, 115, 22, 0.45)',
    stroke: '#f97316',
    strokeDasharray: '2 2',
    strokeWidth: 1,
    strokeOpacity: 0.7,
    connectNulls: true,
    isAnimationActive: false
  }),
  React.createElement(Line, { dataKey: 'vol', stroke: '#38bdf8', strokeWidth: 2, connectNulls: true }),
  React.createElement(Line, { dataKey: 'proyeksi', stroke: '#f97316', strokeWidth: 3, connectNulls: true })
);

const html = ReactDOMServer.renderToString(element);
console.log('Generated HTML Length:', html.length);
const areas = html.match(/class=\"recharts-curve recharts-area-area\"[^>]*d=\"([^\"]+)\"/g);
console.log('Rendered Area paths count:', areas ? areas.length : 0);
if (areas) {
  areas.forEach((a, i) => console.log(`Area ${i} path sample:`, a.slice(0, 100)));
}
