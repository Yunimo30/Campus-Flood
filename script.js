window.addEventListener("DOMContentLoaded", () => {
  // Map init
  const map = L.map("map").setView([14.6098, 120.9896], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // UI refs
  const campusSelect = document.getElementById("campusSelect");
  const intensityInput = document.getElementById("intensity");
  const durationInput = document.getElementById("duration");
  const runBtn = document.getElementById("runSim");
  const floodTbody = document.querySelector("#floodTable tbody");
  const kpiOnset = document.getElementById("kpiOnset");
  const kpiRoutes = document.getElementById("kpiRoutes");

  // Populate dropdown and add markers
  const markers = [];
  campuses.forEach((c, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = c.name;
    campusSelect.appendChild(opt);

    const m = L.marker(c.coords).addTo(map).bindPopup(c.name);
    markers.push(m);
  });

  // default selection = first campus
  campusSelect.value = 0;
  map.setView(campuses[0].coords, 15);

  // Charts: rainfall profile (line) and hazard breakdown (pie)
  const rainfallCtx = document.getElementById("rainfallChart").getContext("2d");
  const rainfallChart = new Chart(rainfallCtx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Intensity (mm/hr)", data: [], borderColor: "#365a9b", fill: false }] },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const hazardCtx = document.getElementById("hazardChart").getContext("2d");
  const hazardChart = new Chart(hazardCtx, {
    type: "pie",
    data: { labels: ["Safe","Moderate","High","Severe"], datasets: [{ data: [0,0,0,0], backgroundColor: ["#22c55e","#fbbf24","#f97316","#ef4444"] }] },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Calculation helpers
  function totalRainfall(intensity, durationMin) {
    return intensity * (durationMin / 60); // mm
  }

  function expectedFloodHeightCm(totalRain, sensitivity) {
    const raw = totalRain * sensitivity * SIM_CONFIG.HEIGHT_SCALE; // cm
    return Math.min(raw, SIM_CONFIG.MAX_HEIGHT_CM);
  }

  function classifyByHeight(cm) {
    if (cm < 20) return { level: "Low", css: "green" };
    if (cm < 50) return { level: "Moderate", css: "yellow" };
    if (cm < 100) return { level: "High", css: "orange" };
    return { level: "Severe", css: "red" };
  }

  // Main update: table, charts, KPIs, map buffer
  function runSimulation() {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    const intensity = parseFloat(intensityInput.value) || 0;
    const duration = parseFloat(durationInput.value) || 0;
    const totRain = totalRainfall(intensity, duration);

    // update table rows (per-street)
    floodTbody.innerHTML = "";
    const counts = { safe:0, moderate:0, high:0, severe:0 };
    let earliestOnsetMin = Infinity;

    campus.streets.forEach(street => {
      const h = expectedFloodHeightCm(totRain, street.sensitivity);
      const cls = classifyByHeight(h);

      if (cls.css === "green") counts.safe++;
      else if (cls.css === "yellow") counts.moderate++;
      else if (cls.css === "orange") counts.high++;
      else counts.severe++;

      // estimate onset: approximate minutes until flood ~ proportional inverse to intensity
      // if intensity is zero, onset is infinity; otherwise rough estimate:
      const onset = intensity > 0 ? Math.max(5, Math.round((cls.css==="green"?999: (50 / (intensity/10)) * street.sensitivity))) : Infinity;
      if (onset < earliestOnsetMin) earliestOnsetMin = onset;

      const row = document.createElement("tr");
      row.innerHTML = `<td>${street.name}</td>
        <td><span class="badge ${cls.css}">${cls.level}</span></td>
        <td>${h.toFixed(1)}</td>`;
      floodTbody.appendChild(row);
    });

      // Update rainfall chart: create a synthetic rainfall curve
      const slices = Math.max(1, Math.ceil(duration / 10));
      rainfallChart.data.labels = Array.from({ length: slices }, (_, i) => `${i * 10}m`);

      // Synthetic curve (bell-shaped rainfall event)
      rainfallChart.data.datasets[0].data = Array.from({ length: slices }, (_, i) => {
        const t = i / (slices - 1 || 1); // normalized time [0..1]
        return intensity * Math.exp(-Math.pow((t - 0.5) * 3, 2)); // peak in middle
      });

      rainfallChart.update();


    // update hazard pie
    hazardChart.data.datasets[0].data = [counts.safe, counts.moderate, counts.high, counts.severe];
    hazardChart.update();

    // KPIs
    kpiOnset.textContent = isFinite(earliestOnsetMin) ? earliestOnsetMin : "N/A";
    kpiRoutes.textContent = counts.safe;

    // Map: center on campus + draw 1km buffer circle colored by overall severity
    map.setView(campus.coords, 14);

    // remove existing buffer layer if any
    if (window._campusBuffer) { map.removeLayer(window._campusBuffer); window._campusBuffer = null; }

    // compute an overall average height to decide buffer color
    const avgHeight = (campus.streets.reduce((s, st) => s + expectedFloodHeightCm(totRain, st.sensitivity), 0) / campus.streets.length);
    const overallCls = classifyByHeight(avgHeight);
    const colorMap = { green: "#22c55e", yellow: "#fbbf24", orange: "#f97316", red: "#ef4444" };

    window._campusBuffer = L.circle(campus.coords, {
      radius: 300, // meters
      color: colorMap[overallCls.css],
      fillColor: colorMap[overallCls.css],
      fillOpacity: 0.18,
      weight: 2
    }).addTo(map);

    // open popup for campus marker (if any marker exists)
    const marker = markers[campusIndex];
    if (marker) marker.openPopup();
  }

  // hook run button and campus change
  runBtn.addEventListener("click", runSimulation);
  campusSelect.addEventListener("change", runSimulation);

  // scenario buttons
  document.querySelectorAll(".scenario-btn").forEach(b => {
    b.addEventListener("click", () => {
      intensityInput.value = b.dataset.i;
      durationInput.value = b.dataset.d;
      runSimulation();
    });
  });

  // initial run on load
  runSimulation();
});
