import knowledgeJson from '../../knowledge.json';
import { KnowledgeBase } from '../types/chat';

export const KNOWLEDGE_DATA: KnowledgeBase = knowledgeJson;

export interface DogTip {
  id: string;
  title: string;
  tip: string;
  source: string;
}

export const DOG_TIPS: DogTip[] = [
  {
    id: "tip-manual",
    title: "Model-Specific Manual",
    tip: "Always consult your unit's model-specific manual for regeneration settings, valve programming, and suitable salt types.",
    source: "EPA WaterSense"
  },
  {
    id: "tip-brine",
    title: "Brine & Regeneration",
    tip: "Regeneration restores the resin bed using brine and requires both salt and water. Check salt levels periodically per manual recommendations.",
    source: "EPA WaterSense"
  },
  {
    id: "tip-safety",
    title: "Softening vs Disinfection",
    tip: "Softening addresses mineral hardness (calcium and magnesium). It does not establish microbiological safety or replace certified water contaminant testing.",
    source: "Penn State Extension"
  },
  {
    id: "tip-efficiency",
    title: "Efficiency & Demand",
    tip: "Compare measured water hardness, household demand, and unit rated capacity. Review salt and water efficiency ratings when checking performance.",
    source: "EPA WaterSense"
  },
  {
    id: "tip-monitor",
    title: "Performance Monitoring",
    tip: "Monitor your water feel and soap lather. If hardness or scale returns unexpectedly, refer to your model manual and seek authorized service.",
    source: "EPA WaterSense"
  },
  {
    id: "tip-measure",
    title: "Measure Hardness First",
    tip: "Always measure raw water hardness before selecting treatment capacity or configuring regeneration frequency.",
    source: "Penn State Extension"
  }
];

export const DEFAULT_PROMPTS = [
  {
    id: "basics",
    name: "Water basics",
    content: "Explain water softening concepts clearly and concisely for household customers, focusing on mineral hardness and measurement.",
    isDefault: true
  },
  {
    id: "guidance",
    name: "Product guidance",
    content: "Assist users in evaluating water softeners based on household water demand, measured hardness, and salt/water efficiency.",
    isDefault: true
  },
  {
    id: "maintenance",
    name: "Maintenance",
    content: "Guide customers on routine upkeep, brine tank inspection, manual guidance, and performance monitoring.",
    isDefault: true
  }
];

export const SIMULATED_MODELS = [
  { id: "gpt-4", name: "GPT-4 (simulated)" },
  { id: "claude-3-5", name: "Claude 3.5 (simulated)" },
  { id: "llama-local", name: "Local Llama (simulated)" }
];

