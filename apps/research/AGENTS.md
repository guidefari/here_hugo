# Research authoring

- This is a Foldkit application. Keep init/update/view pure, express side effects
  as Commands, and keep runtime boot in `src/entry.ts`. Follow the conventions in
  `apps/gpu/AGENTS.md` at the repository root when changing Foldkit code.

- Use the repository's `research` skill for primary-source investigation.
- Load `show-me` when writing or substantially updating reports. Include a small
  visual that explains the mechanism, ownership boundary, or comparison better
  than prose alone. See `.agents/skills/research/SKILL.md` at the repository root.
- Keep visuals beside the relevant text, use the shared theme, and verify mobile
  layouts and light/dark modes. Text diagrams and semantic HTML figures work
  without adding a diagram renderer.
- Preserve evidence cutoffs, citations, limitations, and agent attribution.
- Keep private repository findings in the notes vault, not in this repository,
  including drafts. Publication and deployment are separate approval steps.
