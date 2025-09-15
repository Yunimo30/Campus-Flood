// Basic client-side app logic
let map, markers = {}, chart;

function initMap() {
  map = L.map('map').setView([14.6, 121.0], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  CAMPUS_DATA.forEach(c => {
    const m = L.circleMarker([c.lat, c.lon], { radius: 10 }).addTo(map);
    m.bindPopup(`<strong>${c.name}</strong><br>Elevation: ${c.elevation} m`);
    markers[c.id] = m;
  });
}

function populateCampusSelect() {
  const sel = document.getElementById('campusSelect');
  CAMPUS_DATA.forEach(c => {
    const opt = document.createElement('option'); 
    opt.value = c.id; 
    opt.text = c.name; 
    sel.appendChild(opt);
  });
}

function getFloodRisk(rainfall, elevation) {
  // elevation factor normalizes effect (higher elevation -> lower risk)
  const elevationFactor = Math.max(0, (100 - elevation) / 100);
  const adjusted = rainfall * (1 + elevationFactor);

  if (adjusted < RISK_THRESHOLDS.low) return { level: 'Low', color: '#00ff00', score: adjusted };
  if (adjusted < RISK_THRESHOLDS.medium) return { level: 'Medium', color: '#ffff00', score: adjusted };
  if (adjusted < RISK_THRESHOLDS.high) return { level: 'High', color: '#ff8800', score: adjusted };
  return { level: 'Critical', color: '#ff0000', score: adjusted };
}

function updateUI() {
  const campusId = document.getElementById('campusSelect').value;
  const rainfall = Number(document.getElementById('rainfallRange').value);
  document.getElementById('rainValue').innerText = rainfall;

  const campus = CAMPUS_DATA.find(c => c.id === campusId);
  const risk = getFloodRisk(rainfall, campus.elevation);

  // Update marker color & popup
  const m = markers[campusId];
  m.setStyle({ color: risk.color, fillColor: risk.color });
  m.setPopupContent(`<strong>${campus.name}</strong><br>Elevation: ${campus.elevation} m<br>Risk: ${risk.level}`);
  map.setView([campus.lat, campus.lon], 14);

  // Update recommendation text
  const rec = document.getElementById('recText');
  if (risk.level === 'Low') rec.innerHTML = 'Normal operations — no suspension recommended.';
  else if (risk.level === 'Medium') rec.innerHTML = 'Monitor conditions; advise caution for ground-level travel.';
  else if (risk.level === 'High') rec.innerHTML = 'Prepare for possible suspension; consider early dismissal.';
  else rec.innerHTML = 'Recommend suspension and immediate precautions — Severe flooding risk.';

  // Update chart (simple single-point bar)
  chart.data.datasets[0].data = [risk.score];
  chart.update();
}

function initChart() {
  const ctx = document.getElementById('riskChart');
  chart = new Chart(ctx, {
    type: 'bar',
    data: { labels: ['Flood Score'], datasets: [{ label: 'Adjusted Risk', data: [0] }] },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

function bindEvents() {
  document.getElementById('rainfallRange').addEventListener('input', updateUI);
  document.getElementById('campusSelect').addEventListener('change', updateUI);
}

window.addEventListener('DOMContentLoaded', () => {
  initMap(); 
  populateCampusSelect(); 
  initChart(); 
  bindEvents();
  // default select first and update
  document.getElementById('campusSelect').selectedIndex = 0;
  updateUI();
});
