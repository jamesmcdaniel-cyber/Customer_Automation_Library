import { useEffect, useState } from 'react';
import { assetUrl } from '../lib/cn';

// Before/after picture of MCP: point-to-point integrations vs. one Backstory MCP hub.
// Moving dots show data flowing from the tools toward the assistants.
// Drawn as one SVG so the connecting lines always meet the nodes, at any width.

const ASSISTANTS = [
  ['Claude', 'claude.svg'],
  ['ChatGPT', 'openai.svg'],
  ['Copilot', 'copilot.svg'],
];
const SOURCES = [
  ['Salesforce', 'salesforce.svg'],
  ['Gmail', 'gmail.svg'],
  ['Zoom', 'zoom.svg'],
];

const W = 380;
const H = 176;
const CHIP_W = 104;
const CHIP_H = 34;
const ROWS = [50, 100, 150];
const RIGHT_X = W - CHIP_W;
const HUB = { x: 138, y: 58, w: 104, h: 84 };

// Horizontal S-curve between two points.
const curve = (x1, y1, x2, y2) => {
  const mid = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
};

// Honors the OS "reduce motion" setting; SMIL animations can't be paused from CSS.
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

// A dot travelling along a path. reverse runs it from the path's end back to its start.
function Pulse({ d, dur, begin, reverse, className }) {
  return (
    <circle r={2.6} className={className}>
      <animateMotion
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        path={d}
        keyPoints={reverse ? '1;0' : '0;1'}
        keyTimes="0;1"
        calcMode="linear"
      />
    </circle>
  );
}

// Arrowhead drawn where data arrives (the assistant end).
function Arrow({ id, className }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 Z" className={className} />
    </marker>
  );
}

function Chip({ x, y, name, logo }) {
  return (
    <g>
      <rect x={x} y={y - CHIP_H / 2} width={CHIP_W} height={CHIP_H} rx={8} className="fill-white stroke-ac-light-gray" />
      <image href={assetUrl(`assets/logos/${logo}`)} x={x + 10} y={y - 9} width={18} height={18} />
      <text x={x + 36} y={y + 4} className="fill-ac-dark text-[12px] font-medium">{name}</text>
    </g>
  );
}

function Caption({ x, children, anchor = 'start' }) {
  return (
    <text x={x} y={14} textAnchor={anchor} className="fill-ac-med-gray font-mono text-[9px] uppercase tracking-[0.08em]">
      {children}
    </text>
  );
}

function Columns({ rightCaption }) {
  return (
    <>
      <Caption x={0}>AI assistants</Caption>
      <Caption x={W} anchor="end">{rightCaption}</Caption>
      {ASSISTANTS.map(([name, logo], i) => <Chip key={name} x={0} y={ROWS[i]} name={name} logo={logo} />)}
      {SOURCES.map(([name, logo], i) => <Chip key={name} x={RIGHT_X} y={ROWS[i]} name={name} logo={logo} />)}
    </>
  );
}

export function BeforeDiagram() {
  const reduced = useReducedMotion();
  // Paths run assistant → tool; data flows back the other way, so pulses run in reverse.
  const links = ROWS.flatMap((y1) => ROWS.map((y2) => ({ key: `${y1}-${y2}`, d: curve(CHIP_W, y1, RIGHT_X, y2) })));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full font-sans normal-case tracking-normal" role="img" aria-label="Before MCP: Claude, ChatGPT, and Copilot each need a separate custom integration to Salesforce, Gmail, and Zoom, nine in total.">
      <defs><Arrow id="arrow-before" className="fill-ac-med-gray" /></defs>
      {links.map(({ key, d }) => (
        <path key={key} d={d} fill="none" markerStart="url(#arrow-before)" className="stroke-ac-med-gray/50" strokeWidth={1.25} />
      ))}
      {!reduced && links.map(({ key, d }, i) => (
        <Pulse key={`p${key}`} d={d} dur={5.6} begin={-i * 0.62} reverse className="fill-ac-med-gray" />
      ))}
      <Columns rightCaption="Your tools" />
      <g>
        <rect x={W / 2 - 50} y={88} width={100} height={24} rx={12} className="fill-white stroke-ac-light-gray" />
        <text x={W / 2} y={104} textAnchor="middle" className="fill-ac-dark-secondary font-mono text-[9.5px] uppercase tracking-[0.06em]">9 custom links</text>
      </g>
    </svg>
  );
}

export function AfterDiagram() {
  const reduced = useReducedMotion();
  const hubMidY = HUB.y + HUB.h / 2;
  // Tools → Backstory, then Backstory → each assistant.
  const inbound = ROWS.map((y) => curve(RIGHT_X, y, HUB.x + HUB.w, hubMidY));
  const out = ROWS.map((y) => curve(CHIP_W, y, HUB.x, hubMidY));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full font-sans normal-case tracking-normal" role="img" aria-label="With MCP: Claude, ChatGPT, and Copilot each connect once to the Backstory MCP server, and Backstory already captures Salesforce, Gmail, and Zoom.">
      <defs><Arrow id="arrow-after" className="fill-ac-coral" /></defs>
      {out.map((d, i) => (
        <path key={`o${i}`} d={d} fill="none" markerStart="url(#arrow-after)" className="stroke-ac-coral/60" strokeWidth={1.75} />
      ))}
      {inbound.map((d, i) => (
        <path key={`i${i}`} d={d} fill="none" className="stroke-ac-coral-light/70" strokeWidth={1.75} />
      ))}
      {!reduced && (
        <>
          {inbound.map((d, i) => <Pulse key={`pi${i}`} d={d} dur={2.8} begin={-i * 0.9} className="fill-ac-coral-light" />)}
          {out.map((d, i) => <Pulse key={`po${i}`} d={d} dur={2.8} begin={1.4 - i * 0.9} reverse className="fill-ac-coral" />)}
        </>
      )}
      <Columns rightCaption="Captured by Backstory" />
      <g>
        <rect x={HUB.x - 4} y={HUB.y - 4} width={HUB.w + 8} height={HUB.h + 8} rx={18} className="fill-ac-coral/10" />
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx={14} strokeWidth={1.5} className="fill-white stroke-ac-coral" />
        <image href={assetUrl('assets/backstory-logo.svg')} x={W / 2 - 17} y={HUB.y + 12} width={34} height={27} />
        <text x={W / 2} y={HUB.y + 55} textAnchor="middle" className="fill-ac-dark text-[13px] font-bold">Backstory</text>
        <text x={W / 2} y={HUB.y + 70} textAnchor="middle" className="fill-ac-coral-dark font-mono text-[9px] uppercase tracking-[0.1em]">MCP server</text>
      </g>
    </svg>
  );
}
