// Measure About section geometry (run via agent-browser eval)
(() => {
  const grids = document.querySelectorAll('#about .grid');
  let grid = null;
  for (const g of grids) {
    if (g.classList.contains('lg:grid-cols-2')) { grid = g; break; }
  }
  if (!grid) return JSON.stringify({ error: 'no grid' });
  const cols = grid.children;
  const c = cols[0].getBoundingClientRect();
  const s = cols[1].getBoundingClientRect();
  const chip = grid.querySelector('.glass-light');
  const chipR = chip ? chip.getBoundingClientRect() : null;
  return JSON.stringify({
    collage: { top: Math.round(c.top), bottom: Math.round(c.bottom), h: Math.round(c.height) },
    story: { top: Math.round(s.top), bottom: Math.round(s.bottom), h: Math.round(s.height) },
    chip: chipR ? { top: Math.round(chipR.top), bottom: Math.round(chipR.bottom), start: Math.round(chipR.left), end: Math.round(chipR.right) } : null,
  });
})()
