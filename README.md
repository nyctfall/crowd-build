# Crowdbuild

PC Part Picker clone, but with news, recommendations (peer-reviewed), reviews (like TechSpot), forum posts (like r/PCMasterRace), and performance tests (like PCMark, Cinebench, PugetBench, 3DMark, GFXBench, SPECviewperf, PassMark, Phoronix, or GeekBench, but all done using Web Assembly and WebGL/WebGPU in the browser). 

Essentially PC Part Picker if combined with an alternate reality version of UserBenchmark that was NOT skewed beyond all sense and reason.

## Project Goal

### Core Features
---
 
 - PC part database.

 - PC part list.

 - PC part pros and cons, database of known issues and idiosyncratic behavior.

 - PC part performance review database, MetaCritic style with both user-generated and professional reviews.

 - Links to purchase on retailer/e-tailer sites (e.g.: Micro Center, Newegg, etc.).

 - Crowd-sourced peer-reviewed recommendation knowledge database. Essentially combining the Linus Tech Tips PSU Tier List, the LTT Motherboard Tier Lists, every reliable source for PC part specs and reviews (manufacturer spec sheets, and reviews like Tech Spot, TechPowerUp, etc.), and more!

 - User accounts.

 - User forum.

 - Posting of PC build pictures.

### Core Princibles
---

 - Objective encyclopedic perspective unless otherwise stated as opinion/subjective.

 - Peer reviews for all data presented as truth.

 - No Fanboy-isms.

---
## Get Started

This project uses both NPM workspaces and PNPM workspaces.

```pnpm
pnpm install
```

or

```npm
npm install
npm install --workspaces
```

## The Website

The site is a SPA app that uses React Router. It has user accounts and the functionality to save lists publicly editable or just modifiable by the user that created it. It has a search feature to find PC parts and PC part lists. 