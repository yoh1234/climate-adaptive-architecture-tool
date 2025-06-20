# Climate-Adaptive Architecture Tool for New Orleans

This prototype evaluates how a building design will perform against projected flood risk in New Orleans through 2055. Architects can adjust foundation type, elevation, materials, and mitigation features, then receive a quantitative resilience score, the last safe year (“cutoff year”), and AI‑generated recommendations.

---

## Prerequisites

* Node.js 18 LTS (or later)
* npm 9 (comes with Node 18) or Yarn / pnpm
* An OpenAI API key for GPT‑4 access

---

## Local Setup

```bash
# clone repository
git clone <repo-url>
cd flood-resilience-tool

# install dependencies
npm install        # or: yarn install, pnpm install

# configure environment variables
cp .env.local.example .env.local
# then edit .env.local and add your key:
# OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXX
```

### Running the Development Server

```bash
npm run dev        # or: yarn dev
```

Open `http://localhost:3000` in your browser and run a simulation.

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

`OPENAI_API_KEY` is required for the language‑model recommendation step.

```
# .env.local
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXX
```

---

## Folder Structure (truncated)

```
domain/           data tables for scoring
services/         simulation, scoring, GPT prompt logic
components/       React UI
pages/            Next.js routes (main + API)
```

---

## Brief Write‑up: Modeling Approach

1. **Scoring system**  
   Foundation, elevation, material, and mitigation features are mapped to weighted points (total 100). Higher elevation and stronger materials yield higher scores.

2. **Flood simulation**  
   Combines neighborhood Base Flood Elevation (BFE) with a worst‑case sea‑level rise scenario (1.0‑HIGH). Finds the first year the combined flood line surpasses building elevation.

3. **Language‑model feedback**  
   A GPT‑4 prompt contains user input, score breakdown, cost tables, and flood context. The model returns a single paragraph recommendation and a cost‑benefit paragraph.

---

## What I Would Build Next

* Replace mock sea‑level tables with NOAA projections and dynamic BFE lookup.
* Calibrate scoring weights with FEMA engineering data.
* Add map overlays for neighborhoods and live elevation sliders.
* Allow multiple design revisions and PDF export of reports.
* Factor lifecycle maintenance cost into the cost‑benefit analysis.

---

## License

Prototype code supplied for interview evaluation only. Not licensed for production use.
