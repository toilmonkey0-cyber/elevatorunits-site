/* Client-side search of the bundled Palm Beach sample. Nothing is sent. */
const RECORDED_6728 = {
  dataDate: "Oct 25, 2026, 6:48 AM ET",
  installYear: "1965",
  classLabel: "02 hydraulic",
  status: "20 active",
  contract: "SERV",
  servicer: "LIBERTY ELEVATOR CORPORATION",
};

const NOT_IN_RECORD = "not in DBPR record";
const NOT_IN_SAMPLE = "not in this sample";
const RESULT_CAP = 30;

const COVERAGE_TESTS = [
  {
    pattern: /MIAMI BEACH/,
    text: "The City of Miami Beach runs its own elevator program, so state data is not available here. ElevatorUnits does not have that unit list yet. This demo only searches a Palm Beach sample. A miss does not mean the building has no elevators.",
  },
  {
    pattern: /MIAMI-DADE|MIAMI DADE|\bDORAL\b|\bHIALEAH\b|\bAVENTURA\b|CORAL GABLES/,
    text: "Miami-Dade coverage is partial. The extension uses the Office of Elevator Safety list, data as of Oct 28, 2026. Owner and install year on those rows say Not in county record. This demo only searches a Palm Beach sample, so it cannot show that county list. A miss does not mean the building has no elevators.",
  },
  {
    pattern: /\bBROWARD\b|FORT LAUDERDALE|\bHOLLYWOOD\b|PEMBROKE|POMPANO|CORAL SPRINGS|\bSUNRISE\b/,
    text: "Broward coverage is partial. The extension uses the Elevator Section release, data as of Oct 2026. The servicer on those rows is labeled Contractor per county record. Owner and install year say Not in county record. This demo only searches a Palm Beach sample. A miss does not mean the building has no elevators.",
  },
  {
    pattern: /BAY LAKE|LAKE BUENA VISTA/,
    text: "The Central Florida Tourism Oversight District runs its own elevator program. This Palm Beach sample does not include the district file. A Bay Lake or Lake Buena Vista address that is not in that file still says ElevatorUnits does not have their data yet.",
  },
  {
    pattern: /\bMIAMI\b/,
    text: "Miami can mean the City of Miami or Miami-Dade County. The City of Miami runs its own program, and ElevatorUnits does not have that unit list yet. Miami-Dade coverage is partial. This demo only searches a Palm Beach sample. A miss does not mean the building has no elevators.",
  },
];

function norm(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/&/g, " AND ")
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function rowObject(raw) {
  return {
    license: raw[0],
    street: raw[1],
    line2: raw[2],
    line3: raw[3],
    city: raw[4],
    zip: raw[5],
    licensee: raw[6],
    business: raw[7],
  };
}

function coverageNote(query) {
  for (const entry of COVERAGE_TESTS) {
    if (entry.pattern.test(query)) return entry.text;
  }
  return "";
}

function searchSample(rows, raw) {
  const query = norm(raw);
  if (!query) return { matches: [], total: 0, coverage: "", zipOnly: false, empty: true };
  if (/^\d+$/.test(query)) {
    const exact = rows.filter((row) => row.license === query);
    if (exact.length) {
      return {
        matches: exact.map((row) => ({ row, confidence: "Exact" })),
        total: exact.length,
        coverage: "",
        zipOnly: false,
        empty: false,
        licenseWin: true,
      };
    }
    if (query.length === 5) {
      return { matches: [], total: 0, coverage: coverageNote(query), zipOnly: true, empty: false };
    }
  }
  const matches = [];
  for (const row of rows) {
    const street = norm(row.street);
    const city = norm(row.city);
    const licensee = norm(row.licensee);
    const business = norm(row.business);
    const zip = String(row.zip || "").trim();
    const licenseeKey = licensee && licensee !== city ? licensee : "";
    const businessKey = business && business !== city ? business : "";
    let confidence = "";
    if (street && city && query.includes(street) && query.includes(city) && zip && query.includes(zip)) {
      confidence = "Exact";
    } else if (street && city && query.includes(street) && query.includes(city)) {
      confidence = "Likely";
    } else if (licenseeKey && (query === licenseeKey || (licenseeKey.length >= 8 && query.includes(licenseeKey)))) {
      confidence = "Exact";
    } else if (businessKey && (query === businessKey || (businessKey.length >= 8 && query.includes(businessKey)))) {
      confidence = "Exact";
    } else if (licenseeKey && query.length >= 6 && licenseeKey.includes(query)) {
      confidence = "Likely";
    } else if (businessKey && query.length >= 6 && businessKey.includes(query)) {
      confidence = "Likely";
    }
    if (confidence) matches.push({ row, confidence });
  }
  matches.sort((a, b) => {
    if (a.confidence !== b.confidence) return a.confidence === "Exact" ? -1 : 1;
    return a.row.license.localeCompare(b.row.license, "en");
  });
  return {
    matches,
    total: matches.length,
    coverage: matches.length ? "" : coverageNote(query),
    zipOnly: false,
    empty: false,
    licenseWin: false,
  };
}

function field(dl, label, value, note) {
  const wrap = document.createElement("div");
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.append(document.createTextNode(value));
  if (note) {
    const span = document.createElement("span");
    span.className = "eu-note";
    span.textContent = note;
    dd.append(span);
  }
  wrap.append(dt, dd);
  dl.append(wrap);
}

function rawAddress(row) {
  const parts = [row.street, row.line2, row.line3, row.city, "FL", row.zip].filter((part) => String(part || "").trim());
  return parts.join(", ").replace(", FL,", ", FL");
}

function renderUnit(match) {
  const row = match.row;
  const recorded = row.license === "6728" ? RECORDED_6728 : null;
  const article = document.createElement("article");
  article.className = "eu-card eu-panel";
  const kicker = document.createElement("p");
  kicker.className = "eu-kicker";
  kicker.textContent = "Sample row · not a live lookup";
  const title = document.createElement("h2");
  title.textContent = `License ${row.license}`;
  const address = document.createElement("p");
  address.className = "eu-address";
  address.textContent = rawAddress(row);
  article.append(kicker, title, address);
  const meta = document.createElement("p");
  meta.className = "eu-panel-meta";
  meta.textContent = recorded
    ? `Data date: ${recorded.dataDate}. This date is from the recorded popup for this license. The sample file itself has no data date.`
    : "Data date: not in this sample";
  article.append(meta);
  const dl = document.createElement("dl");
  dl.className = "eu-panel-fields";
  field(dl, "Match confidence", match.confidence);
  field(dl, "Install year", recorded ? recorded.installYear : NOT_IN_SAMPLE);
  field(dl, "Class", recorded ? recorded.classLabel : NOT_IN_SAMPLE);
  field(dl, "Status", recorded ? recorded.status : NOT_IN_SAMPLE);
  field(
    dl,
    "Service contract",
    recorded ? recorded.contract : NOT_IN_SAMPLE,
    recorded ? "as reported to DBPR" : "",
  );
  field(
    dl,
    "Servicer",
    recorded ? recorded.servicer : NOT_IN_SAMPLE,
    recorded ? `per DBPR record, data date: ${recorded.dataDate}` : "",
  );
  field(dl, "Licensee Name (certificate holder, per DBPR record)", row.licensee.trim() || NOT_IN_RECORD);
  field(dl, "Business Name (per DBPR record)", row.business.trim() || NOT_IN_RECORD);
  field(dl, "Raw address in this sample", rawAddress(row));
  article.append(dl);
  if (recorded) {
    const tier = document.createElement("p");
    tier.className = "eu-tier";
    tier.textContent = "Higher priority";
    const dlm = document.createElement("p");
    dlm.textContent =
      "DLM check: ASME A17.3-2020 §3.10.12 compliance required from August 1, 2025, enforcement not until August 1, 2029 — verify DLM status, do not assume it is installed.";
    const disclaimer = document.createElement("p");
    disclaimer.textContent = "Not code advice. Confirm with a licensed elevator contractor and DBPR.";
    const source = document.createElement("p");
    source.className = "eu-source";
    source.textContent =
      "Class, status, install year, service contract, and servicer for license 6728 are transcribed from store/assets/palm-beach-units.png. The sample file does not include those columns.";
    article.append(tier, dlm, disclaimer, source);
  }
  return article;
}

function renderResults(root, result) {
  root.replaceChildren();
  if (result.empty) {
    const p = document.createElement("p");
    p.textContent = "Enter an address, a name, or a license number from the Palm Beach sample.";
    root.append(p);
    return;
  }
  if (result.zipOnly) {
    const p = document.createElement("p");
    p.textContent =
      "That is a 5-digit number and it is not a license in this sample. A zip alone is not a lookup. Add a street.";
    root.append(p);
  }
  const summary = document.createElement("p");
  if (result.total === 0 && !result.zipOnly) {
    summary.textContent =
      "No row in this Palm Beach sample matched. That does not mean the building has no elevators. This demo is not the full DBPR extract.";
  } else if (result.total === 1 && result.licenseWin) {
    summary.textContent = "1 unit in this sample. The digits matched a license number, so they were not read as a zip.";
  } else if (result.total === 1) {
    summary.textContent = "1 unit in this sample.";
  } else if (result.total > RESULT_CAP) {
    summary.textContent = `${result.total} rows matched. The first ${RESULT_CAP} are listed. Add a city or a zip to narrow them. None are dropped silently from the count.`;
  } else {
    summary.textContent = `${result.total} rows matched. Every match is listed.`;
  }
  root.append(summary);
  if (result.coverage) {
    const aside = document.createElement("aside");
    aside.className = "eu-card eu-notice";
    const heading = document.createElement("h2");
    heading.textContent = "Coverage";
    const body = document.createElement("p");
    body.textContent = result.coverage;
    aside.append(heading, body);
    root.append(aside);
  }
  for (const match of result.matches.slice(0, RESULT_CAP)) root.append(renderUnit(match));
}

function rowsFromSample() {
  return globalThis.PALM_BEACH_SAMPLE.rows.map(rowObject);
}

function initLookup() {
  const form = document.querySelector("#lookup-form");
  const input = document.querySelector("#q");
  const results = document.querySelector("#results");
  if (!form || !input || !results || globalThis.PALM_BEACH_SAMPLE === undefined) return;
  const rows = rowsFromSample();
  const run = (raw) => {
    renderResults(results, searchSample(rows, raw));
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const params = new URLSearchParams(location.search);
      params.set("q", input.value);
      const next = `${location.pathname}?${params.toString()}#results`;
      history.replaceState(null, "", next);
    } catch {
      /* A file:// page may refuse replaceState. The search still stays in the page. */
    }
    run(input.value);
  });
  const initial = new URLSearchParams(location.search).get("q");
  if (initial) {
    input.value = initial;
    run(initial);
  }
}

initLookup();
