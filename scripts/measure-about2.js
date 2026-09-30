(() => {
  const grids = document.querySelectorAll('#about .grid');
  let grid = null;
  for (const g of grids) { if (g.classList.contains('lg:grid-cols-2')) { grid = g; break; } }
  const collage = grid.children[0];
  const photoDivs = collage.querySelectorAll(':scope > div.absolute');
  const out = [];
  for (const p of photoDivs) {
    const r = p.getBoundingClientRect();
    out.push({ top: Math.round(r.top), bottom: Math.round(r.bottom), start: Math.round(r.left), end: Math.round(r.right) });
  }
  const chip = collage.querySelector('.glass-light');
  const cr = chip.getBoundingClientRect();
  const story = grid.children[1].getBoundingClientRect();
  return JSON.stringify({
    photos: out,
    chip: { top: Math.round(cr.top), bottom: Math.round(cr.bottom), start: Math.round(cr.left), end: Math.round(cr.right) },
    storyBottom: Math.round(story.bottom),
  });
})()
