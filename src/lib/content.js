import examplesJson from '../data/examples.json';
import site from '../data/site.json';

export { site };
export const examples = examplesJson.slice().sort((a, b) => a.order - b.order);
export const startHere = examples.find((e) => e.startHere) || examples[0];
export const findExample = (id) => examples.find((e) => e.id === id);
export { default as stories } from '../data/stories.json';
export { default as swaps } from '../data/swaps.json';
