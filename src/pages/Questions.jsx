import { SectionHero } from '../components/SectionHero';
import { BackLink } from '../components/BackLink';
import { Tabs } from '../components/ui/Tabs';
import { CopyButton } from '../components/ui/CopyButton';
import { NextStep } from '../components/NextStep';
import { TocLayout } from '../components/PageToc';
import { SectionHeading } from '../components/SectionHeading';
import { questions } from '../lib/content';

export const questionCount = questions.kinds.reduce((a, k) => a + k.prompts.length, 0);

// "Use with care" prompts share the amber of the example pages' caveat box.
const CARE = 'border-[#F3DDB0] bg-[#FFF7E6] text-[#7A5200]';

export function KindCard({ kind, n }) {
  return (
    <div className="surface-card flex flex-col p-5">
      <div className="font-mono text-[11px] text-ac-coral-dark">0{n}</div>
      <h3 className="mt-0.5 font-display text-[17px] font-bold">{kind.name}</h3>
      <div className="mt-3 flex items-start gap-3 rounded-lg bg-ac-horizon-700 p-3.5 text-white">
        <p className="min-w-0 flex-1 text-[14px] italic leading-6">&ldquo;{kind.example}&rdquo;</p>
        <CopyButton text={kind.example} variant="onDark" className="shrink-0" />
      </div>
      <p className="mt-3 flex-1 text-[13.5px] leading-6 text-ac-dark-secondary">{kind.goodToKnow}</p>
    </div>
  );
}

export function Habits() {
  return (
    <ol className="space-y-3">
      {questions.habits.map(([title, body], i) => (
        <li key={title} className="flex gap-3">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ac-coral/12 font-mono text-[11px] font-bold text-ac-coral-dark">{i + 1}</span>
          <p className="text-[14px] leading-6 text-ac-dark-secondary">
            <strong className="text-ac-dark">{title}</strong> {body}
          </p>
        </li>
      ))}
    </ol>
  );
}

function PromptRow({ p }) {
  return (
    <li className="rounded-lg border border-ac-light-gray bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-[15px] leading-6 text-ac-dark">&ldquo;{p.text}&rdquo;</p>
        <CopyButton text={p.text} className="shrink-0" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {p.who.map((w) => (
          <span key={w} className="rounded-md bg-ac-cream px-2 py-0.5 font-mono text-[10.5px] font-medium text-ac-dark-secondary">{w}</span>
        ))}
        {p.note && !p.care && <span className="ml-1 text-[12.5px] leading-5 text-ac-med-gray">{p.note}</span>}
      </div>
      {p.care && <p className={`mt-2 rounded-md border px-3 py-2 text-[13px] leading-5 ${CARE}`}>{p.note}</p>}
    </li>
  );
}

function KindPanel({ kind }) {
  const safe = kind.prompts.filter((p) => !p.care);
  const care = kind.prompts.filter((p) => p.care);
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-ac-horizon-100 bg-ac-horizon-50 px-4 py-3 text-[14px] leading-6 text-ac-dark">
        <span className="mr-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ac-coral-dark">Good to know</span>
        {kind.goodToKnow}
      </div>
      <section>
        <h3 className="eyebrow mb-2">Works as worded · {safe.length}</h3>
        <ul className="space-y-2">
          {safe.map((p) => <PromptRow key={p.text} p={p} />)}
        </ul>
      </section>
      {care.length > 0 && (
        <section>
          <h3 className="eyebrow mb-2">Works, but check the answer · {care.length}</h3>
          <ul className="space-y-2">
            {care.map((p) => <PromptRow key={p.text} p={p} />)}
          </ul>
        </section>
      )}
    </div>
  );
}

function NotYet() {
  return (
    <div className="surface-card divide-y divide-ac-light-gray overflow-hidden">
      <div className="hidden grid-cols-3 gap-5 bg-ac-warm-white px-5 py-2.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ac-dark-secondary md:grid">
        <span>What people ask</span>
        <span>What happens</span>
        <span>Ask this instead</span>
      </div>
      {questions.notYet.map((r) => (
        <div key={r.ask} className="grid gap-1 px-5 py-3 text-[13.5px] leading-6 md:grid-cols-3 md:gap-5">
          <div className="font-medium text-ac-dark">{r.ask}</div>
          <div className="text-ac-dark-secondary">{r.happens}</div>
          <div className="text-ac-dark">
            {r.instead && (
              <>
                <span className="mr-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ac-coral-dark md:hidden">Instead</span>
                {r.instead}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Questions() {
  return (
    <div className="container-page">
      <BackLink to="/resources" label="Additional resources" className="mb-4 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ac-coral-dark hover:text-ac-coral" />
      <SectionHero eyebrow="Additional resources · Questions that work" title="Three kinds of questions" subtitle={questions.intro} image="bg-04.jpg" />
      <TocLayout className="space-y-16">
        <section id="kinds" data-toc="The three kinds" className="grid gap-4 md:grid-cols-3">
          {questions.kinds.map((k, i) => <KindCard key={k.id} kind={k} n={i + 1} />)}
        </section>

        <section id="prompts" data-toc={`All ${questionCount} prompts`}>
          <SectionHeading
            title={`All ${questionCount} prompts`}
            intro="Each one says who usually asks it. The ones in amber work, but check the part of the answer the note names."
          />
          <div className="surface-card p-6">
          <Tabs
            tabs={questions.kinds.map((k) => ({
              value: k.id,
              label: `${k.short} · ${k.prompts.length}`,
              content: <KindPanel kind={k} />,
            }))}
          />
          </div>
        </section>

        <section id="not-yet" data-toc="Not yet">
          <SectionHeading
            title="Not yet"
            intro="These come back wrong, empty, or quietly misread today. Where there’s a question that works instead, it’s on the right."
          />
          <NotYet />
        </section>

        <section id="habits" data-toc="Three habits" className="rounded-xl border border-ac-horizon-100 bg-ac-horizon-50 p-6 sm:p-8">
          <h2 className="mb-5 font-display text-[22px] font-bold leading-tight tracking-[-0.01em] sm:text-[25px]">Three habits that catch most wrong answers</h2>
          <Habits />
        </section>

        <p className="text-[13px] text-ac-dark-secondary">
          Accounts and people shown are mock examples: Nimbus Robotics, Halden Freight, Alex Chen. Swap in your own.
        </p>

        <NextStep text="Next: swap old habits for prompts, by role." to="/resources/swaps" label="Swap cards" />
      </TocLayout>
    </div>
  );
}
