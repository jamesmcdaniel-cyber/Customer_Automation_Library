import examplesJson from '../data/examples.json';
import site from '../data/site.json';

export { site };
export const examples = examplesJson.slice().sort((a, b) => a.order - b.order);
export const findExample = (id) => examples.find((e) => e.id === id);
export { default as stories } from '../data/stories.json';
export { default as swaps } from '../data/swaps.json';
export { default as downloads } from '../data/downloads.json';
export { default as resources } from '../data/resources.json';
export { default as pages } from '../data/pages.json';
