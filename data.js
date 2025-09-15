// campuses + streets with prototype sensitivity values (higher => more flood-prone)
const campuses = [
  {
    id: "dlsu",
    name: "De La Salle University (DLSU - Taft)",
    coords: [14.5646, 120.9939],
    streets: [
      { name: "Taft Avenue", sensitivity: 1.2 },
      { name: "Agno Street", sensitivity: 1.1 },
      { name: "Castro Street", sensitivity: 1.0 },
      { name: "Fidel Reyes St", sensitivity: 1.05 },
      { name: "P. Ocampo St", sensitivity: 1.15 }
    ]
  },
  {
    id: "ust",
    name: "University of Santo Tomas (UST - España)",
    coords: [14.6098, 120.9896],
    streets: [
      { name: "España Boulevard", sensitivity: 1.6 },   // historically very flood-prone
      { name: "Dapitan St", sensitivity: 1.25 },
      { name: "A.H. Lacson Ave", sensitivity: 1.15 },
      { name: "P. Noval St", sensitivity: 1.05 },
      { name: "Laong Laan Rd", sensitivity: 1.05 }
    ]
  },
  {
    id: "mapua_manila",
    name: "Mapúa (Intramuros, Manila)",
    coords: [14.590522, 120.9778143],
    streets: [
      { name: "Muralla St.", sensitivity: 1.2 },
      { name: "Gen. Luna St.", sensitivity: 1.1 },
      { name: "Victoria St.", sensitivity: 1.0 },
      { name: "Anda St.", sensitivity: 1.2 },
      { name: "Real St.", sensitivity: 1.05 }
    ]
  },
  {
    id: "mapua_makati",
    name: "Mapúa (Makati, Pablo Ocampo)",
    coords: [14.5664255, 121.0150138],
    streets: [
      { name: "Pablo Ocampo St.", sensitivity: 1.35 },
      { name: "Chino Roces Ave", sensitivity: 1.05 },
      { name: "Ayala Ave Ext", sensitivity: 1.0 },
      { name: "Filmore St", sensitivity: 1.0 },
      { name: "Zobel Roxas St", sensitivity: 1.05 }
    ]
  },
  {
    id: "upd",
    name: "UP Diliman (Quezon City)",
    coords: [14.6538, 121.0687],
    streets: [
      { name: "University Ave", sensitivity: 1.0 },
      { name: "C.P. Garcia Ave", sensitivity: 1.2 },
      { name: "Katipunan Ave", sensitivity: 1.4 }, // frequently flooded reports
      { name: "Roces Ave", sensitivity: 1.05 },
      { name: "Commonwealth Ave", sensitivity: 1.0 }
    ]
  }
];

// configuration for demo scaling
const SIM_CONFIG = {
  // multiply totalRainfall * sensitivity * HEIGHT_SCALE -> cm
  HEIGHT_SCALE: 0.7,   // chosen so flood heights fall into realistic demo cm range
  MAX_HEIGHT_CM: 150   // cap for display
};
