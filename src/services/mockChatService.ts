import { Attachment, Message } from '../types/chat';
import { KNOWLEDGE_DATA } from '../data/knowledge';

/**
 * Simulated educational chat engine; called on the server in the Railway app.
 * - No external LLM calls or API keys.
 * - 1.5-second realistic response delay.
 * - Answers strictly grounded in EPA WaterSense & Penn State Extension data from knowledge.json.
 * - Transparent about filename-only attachments and educational scope limitations.
 */

export const SIMULATED_DELAY_MS = 1500;

export async function sendMessage(
  sessionId: string,
  userText: string,
  model: string,
  persona: string,
  attachment?: Attachment
): Promise<Message> {
  // Simulate 1.5s delay
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

  const lower = userText.toLowerCase();

  // Check for commercial pricing / quotation queries which must not be answered with invented prices
  const isPricingOrCommercial = ['price', 'pricing', 'quote', 'discount', 'how much does it cost', 'cost to buy'].some(
    (term) => lower.includes(term)
  );

  let responseBody = '';

  if (isPricingOrCommercial) {
    responseBody =
      "I am a simulated educational assistant focusing strictly on water-softening education.\n\n" +
      "• **No Commercial Pricing**: I do not provide commercial price quotes, discounts, sales contracts, or dealer pricing.\n" +
      "• **Equipment Guidance**: When comparing equipment from manufacturers, compare measured water hardness, household water demand, unit grain capacity, and water/salt efficiency ratings.\n" +
      "• **Health & Testing**: Softening addresses mineral hardness. It does not replace drinking water safety tests or contaminant filtration.\n\n" +
      "Topics I cover: water hardness, ion-exchange resin mechanics, brine regeneration cycles, and routine maintenance.";
  } else {
    // Find matching topics from knowledge.json
    const matchedTopics = KNOWLEDGE_DATA.topics.filter((topic) =>
      topic.keywords.some((kw) => lower.includes(kw.toLowerCase()))
    );

    if (matchedTopics.length > 0) {
      // Generate grounded answer from matched topics
      const answers = matchedTopics.map((topic) => {
        const sourceObj = KNOWLEDGE_DATA.sources.find((s) => s.id === topic.source);
        const sourceLabel = sourceObj ? sourceObj.title.split(' - ')[0] : 'Knowledge Base';
        return `${topic.answer} *(Source: ${sourceLabel})*`;
      });

      const coreAnswer = answers.join('\n\n');

      // Contextual persona framing
      let personaFraming = '';
      if (persona.toLowerCase().includes('basic')) {
        personaFraming = 'Here is the foundational water-treatment principle:';
      } else if (persona.toLowerCase().includes('guidance') || persona.toLowerCase().includes('product')) {
        personaFraming = 'From a product selection and efficiency viewpoint:';
      } else if (persona.toLowerCase().includes('maint')) {
        personaFraming = 'From an operational and maintenance viewpoint:';
      } else {
        personaFraming = 'According to standard water-softener principles:';
      }

      responseBody = `${personaFraming}\n\n${coreAnswer}`;
    } else {
      // Fallback response for unrecognised queries, out-of-scope requests, or health claims
      responseBody =
        "I am a simulated educational assistant focusing strictly on household water-softening fundamentals.\n\n" +
        "• **Topics I cover**: Water hardness (calcium/magnesium), ion-exchange resin mechanics, brine regeneration cycles, salt & water efficiency, and routine manual maintenance.\n" +
        "• **Scope limitation**: SoftWater Assist is an educational demonstration. I do not provide commercial price quotes, installation blueprints, or water-potability guarantees.\n" +
        "• **Important Health Note**: Softening addresses mineral hardness. It does *not* filter bacteria, viruses, or hazardous contaminants. Always have your water tested by a certified laboratory for drinking safety.\n\n" +
        "You can ask questions like:\n" +
        "- *\"What is water hardness and how is it measured?\"*\n" +
        "- *\"How does an ion-exchange softener work?\"*\n" +
        "- *\"What happens during regeneration and how much salt is needed?\"*\n" +
        "- *\"How do I choose the right unit size for my home?\"*";
    }
  }

  // Handle filename-only attachments with total transparency
  if (attachment) {
    responseBody += `\n\n*(Attachment noted: "${attachment.name}". Please note: this educational demo only records the file name. File contents are not uploaded, analyzed, or processed by an external model.)*`;
  }

  return {
    id: `msg-assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sender: 'assistant',
    text: responseBody,
    timestamp: Date.now(),
    model,
    persona
  };
}
