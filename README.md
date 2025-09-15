# Production Documentation  
**Campus Flood Simulation — Prototype (Production Phase)**

---

## 1. Overview  
This project is a prototype of a **digital twin flood prediction tool** designed for school campuses. It enables administrators and disaster response teams to simulate rainfall scenarios and assess flood risks on surrounding streets.  

The system integrates **interactive maps (Leaflet.js)** and **visual analytics (Chart.js)** to visualize flood levels, hazard zones, and key performance indicators (KPIs).  

---

## 2. Objectives  
- Provide a **visual decision-support tool** for schools in flood-prone areas.  
- Demonstrate how **historical sensitivity values** (per street) can be used to estimate flood severity.  
- Serve as a **presentation-ready prototype** for stakeholders while remaining extensible for future production.  

---

## 3. Features  
- **Interactive Map:** Leaflet-based map centered on selected campuses with hazard radius overlays.  
- **Campus Selection:** Users can select campuses (DLSU, UST, Mapúa, UPD, etc.) to simulate localized flooding.  
- **Rainfall Simulation:**  
  - Adjustable rainfall intensity (mm/hr).  
  - Adjustable duration (minutes).  
  - Predefined quick-scenario buttons (Light, Moderate, Heavy).  
- **Flood Risk Table:** Tabular breakdown of expected flood levels per street with severity color coding.  
- **Rainfall Profile Chart:** Displays rainfall intensity over time slices.  
- **Hazard Breakdown Chart:** Pie chart summarizing safe, moderate, high, and severe categories.  
- **KPIs:**  
  - Estimated flood onset time (minutes).  
  - Number of passable routes (streets remaining safe).  
  - Placeholder model accuracy (for demonstration).  

---

## 4. System Architecture  
- **Frontend-Only Web Application** (no backend at prototype stage).  
- **Core Components:**  
  - `index.html` → layout and structure.  
  - `style.css` → visual design and theming.  
  - `data.js` → static dataset of campuses and street sensitivities.  
  - `script.js` → business logic, simulation engine, chart/map updates.  
- **Libraries Used:**  
  - [Leaflet.js](https://leafletjs.com/) for interactive mapping.  
  - [Chart.js](https://www.chartjs.org/) for visualization.  

---

## 5. Data Handling  
- **Input Data:**  
  - Rainfall intensity and duration provided by the user.  
  - Historical flood sensitivity values per street (hardcoded).  
- **Simulation Formula:**  
  ```text
  totalRainfall = intensity × (duration / 60)
  expectedFloodHeight (cm) = totalRainfall × sensitivity × scaleFactor
