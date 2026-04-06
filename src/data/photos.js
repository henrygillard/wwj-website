// ── 2025-01 Barton Springs Promo Shoot ───────────────────────────────────────
export const bartonSpringsPhotos = [
  'DSC06956', 'DSC06973', 'DSC06978',
  'DSC06987', 'DSC06995', 'DSC07023', 'DSC07049',
  'DSC07069', 'DSC07123', 'DSC07136',
  'DSC07157', 'DSC07164', 'DSC07182', 'DSC07334',
  'DSC07401', 'DSC07425', 'DSC07459', 'DSC07479',
].map((label) => ({
  label,
  alt: `Wrestle With Jimmy — Barton Springs promo shoot, Austin TX`,
  src: `/photos/barton-springs/${label}.jpg`,
  group: 'bartonSprings',
}))

// ── 2025-12 Radio East ────────────────────────────────────────────────────────
export const radioEastPhotos = [
  'DSC5611', 'DSC5612', 'DSC5618', 'DSC5623', 'DSC5628',
  'DSC5633', 'DSC5634', 'DSC5635', 'DSC5645', 'DSC5648',
  'DSC5650', 'DSC5656', 'DSC5666', 'DSC5682',
].map((label) => ({
  label,
  alt: `Wrestle With Jimmy performing live at Radio East, Austin TX`,
  src: `/photos/radio-east/${label}.jpg`,
  group: 'radioEast',
}))

export const allPhotos = [
  ...bartonSpringsPhotos,
  ...radioEastPhotos,
]
