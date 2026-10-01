'use client';

import * as React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { type FAQItem } from '@agribandhu/types';

export interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border border-neutral-100/80 rounded-xl bg-white px-6 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <AccordionTrigger className="text-neutral-900 font-bold hover:no-underline text-base sm:text-lg py-5 hover:text-primary-600">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-neutral-600 text-sm sm:text-base leading-relaxed pb-5">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
