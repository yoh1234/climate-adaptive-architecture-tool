# Climate-Adaptive Architecture Tool for New Orleans

This prototype evaluates how a building design will perform against projected flood risk in New Orleans through 2060. Architects can adjust foundation type, elevation, materials, and mitigation features, then receive a quantitative resilience score, the last safe year (“cutoff year”), and AI‑generated recommendations.

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
cd climate-adaptive-architecture-tool

# install dependencies
npm install        # or: yarn install, pnpm install

# create a `.env.local` file in the root directory:
# then edit .env.local and add your key:
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

## Modeling Approach & Future Work

### Approach

This prototype estimates flood resilience of building designs in New Orleans through 2060 by combining:

- Real-world sea level rise projections from NOAA
- Mock building component scores (foundation type, elevation, materials, mitigation features)
- Local BFE (Base Flood Elevation) by neighborhood
- A scoring engine that computes overall resilience and a cutoff year based on projected sea level + BFE
- GPT-4-powered recommendations and cost-benefit analysis using descriptive metadata and scenario context

This simulator estimates how well a given building design in New Orleans can withstand flood risks through 2060 under projected sea level rise.

-  **Resilience Score Calculation**

   The resilience score (0–100) is derived from four key design parameters:

   Foundation Type: slab, pier, or elevated - scored for structural elevation potential and water permeability.

   Elevation Above BFE: higher net elevation over the local Base Flood Elevation (BFE) is rewarded.

   Material Selection: materials are scored based on flood resistance, durability, and long-term exposure performance.

   Mitigation Features: features like flood vents or sump pumps increase score based on known protective effectiveness.

   Each component contributes a weighted sub-score to the final resilience score, designed to simulate real-world prioritization.

-  **Cutoff Year Estimation**

   To determine how long the building can withstand flood levels:

   We retrieve BFE for the selected neighborhood.

   We apply NOAA-provided sea level rise projections for different scenarios (e.g., “1.0 - HIGH”).

   We simulate year-by-year increases until flood level (BFE + sea rise) exceeds the building’s elevation, marking that year as the cutoff.

-  **AI-Generated Recommendations**

   The system sends a structured prompt to an LLM (OpenAI GPT-4), which includes:

   Design parameters

   Descriptions and tradeoffs of materials and mitigation options

   Scenario-based flood projections and uncertainty ranges

   The LLM returns two outputs:

   A design recommendation to improve resilience

   A cost-benefit summary highlighting tradeoffs of the proposed upgrade

This allows architects to quickly assess what to improve and why.

### What I'd Build Next

1. **Real-world data integration**
   - Use actual historical and projected sea level data from NOAA (already partially integrated).
   - Expand to include FEMA flood zones, BFE maps, and building permit data by address.

2. **Material and mitigation cost modeling**
   - Replace mock scores with real construction costs and effectiveness data.
   - Enable regional and year-based price adjustments.

3. **AI/RAG-based architecture**
   - Dynamically inject only relevant data into the prompt (e.g., BFE and flood projections for the selected neighborhood).
   - Use retrieval-augmented generation (RAG) to fetch material costs, real-world mitigation impact, and location-specific climate data.
   - Transition to a modular prompt architecture with structured templates and optional function calling for data lookup.

4. **Conversational input**
   - Enable users to describe buildings in natural language (e.g., "a 2-story home with 6 ft elevation in Lakeview using concrete and flood vents").
   - Use an NLP parser to convert input into structured parameters.

5. **Expanded parameter set**
   - Add more granular design inputs like roof type, number of floors, basement presence, adjacent terrain, flood insurance status.
   - Support risk scenarios for wind, rainfall, and compound flooding.
