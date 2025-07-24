import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ProjectHealth } from './ProjectHealth';
import { Timeline } from './Timeline';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const MobileProjectHealth = () => {
  return (
    <div className="lg:hidden">
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="project-health" className="bg-card rounded-lg border px-4">
          <AccordionTrigger className="text-left font-semibold hover:no-underline">
            Project Health Overview
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ProjectHealth />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="timeline" className="bg-card rounded-lg border px-4">
          <AccordionTrigger className="text-left font-semibold hover:no-underline">
            Timeline & Milestones
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Timeline />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};