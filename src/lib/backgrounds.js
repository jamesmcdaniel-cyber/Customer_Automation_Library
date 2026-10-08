// Banner backgrounds: the seven Backstory meeting backgrounds, all cropped to 1920×960 with the
// baked-in tagline and logo strip cut off, so every banner frames its image the same way.
//
// The set is shuffled once per visit and dealt one per section, so Home, the four steps and
// Additional resources never share an image, and a page keeps its image while you move around.
// Sub-pages pass their parent's section (an example or connect guide uses 'use-it').
const BACKGROUNDS = [
  'meeting-bg-01.jpg',
  'meeting-bg-02.jpg',
  'meeting-bg-03.jpg',
  'meeting-bg-04.jpg',
  'meeting-bg-05.jpg',
  'meeting-bg-06.jpg',
  'meeting-bg-10.jpg',
];

const SECTIONS = ['home', 'get-it', 'trust-it', 'use-it', 'stretch-it', 'resources'];

function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const dealt = shuffle(BACKGROUNDS);

export function sectionBackground(section) {
  const i = SECTIONS.indexOf(section);
  return dealt[i === -1 ? SECTIONS.length : i];
}
