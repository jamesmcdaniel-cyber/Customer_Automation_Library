import * as RA from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

// items: [{ value, title, content }]
export function Accordion({ items, defaultValue }) {
  return (
    <RA.Root type="multiple" defaultValue={defaultValue} className="surface-card divide-y divide-ac-light-gray overflow-hidden">
      {items.map((it) => (
        <RA.Item key={it.value} value={it.value}>
          <RA.Header>
            <RA.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ac-dark transition-colors hover:bg-ac-cream/60">
              {it.title}
              <ChevronDown size={16} className="shrink-0 text-ac-med-gray transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </RA.Trigger>
          </RA.Header>
          <RA.Content className="px-5 pb-4 text-[14px] leading-6 text-ac-dark-secondary animate-fade-in">{it.content}</RA.Content>
        </RA.Item>
      ))}
    </RA.Root>
  );
}
