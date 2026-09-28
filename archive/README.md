# Archive

Superseded work, kept for reference. Nothing here is built or deployed, and
nothing in `web/` or `mobile/` depends on it.

## `react-prototype/`

The original React 19 + Vite prototype. It implements eight of the nine
features that the production platform in [`../web/`](../web/) now covers in
plain HTML/CSS/JS: Explore map, monument scanner, marketplace, cultural
events, language transform, community hub, user profile and the AI chat
widget.

Superseded by `web/`. Retained because the component structure in
`src/components/` and the seed data in `src/data/mockData.js` are a useful
record of how the feature set was first shaped.

To run it:

```bash
cd archive/react-prototype
npm install
npm run dev
```
