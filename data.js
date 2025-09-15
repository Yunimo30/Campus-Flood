// Example pre-processed dataset exported from Python as a lightweight JS object
// For production, replace with your full campus lookup table
const CAMPUS_DATA = [
  { id: 'UST', name: 'UST España', lat: 14.6095, lon: 120.9909, elevation: 8 },
  { id: 'DLSU', name: 'DLSU Taft', lat: 14.5586, lon: 120.9986, elevation: 6 },
  { id: 'UPD', name: 'UP Diliman', lat: 14.6536, lon: 121.0743, elevation: 40 }
];

// Example risk thresholds (you can create more detailed lookup matrices)
const RISK_THRESHOLDS = {
  low: 15,
  medium: 25,
  high: 35
};
