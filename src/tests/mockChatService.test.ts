import { describe, it, expect, vi } from 'vitest';
import { sendMessage, SIMULATED_DELAY_MS } from '../services/mockChatService';

describe('Simulated Local Chat Service', () => {
  it('correctly matches hardness keywords and credits Penn State Extension source', async () => {
    const res = await sendMessage(
      'test-session-1',
      'Can you explain what calcium and magnesium scale is in hard water?',
      'GPT-4 (simulated)',
      'Water basics'
    );

    expect(res.sender).toBe('assistant');
    expect(res.text).toContain('Calcium and magnesium cause water hardness');
    expect(res.text).toContain('Penn State Extension');
    expect(res.persona).toBe('Water basics');
  }, 10000);

  it('correctly matches regeneration keywords and references manual instructions', async () => {
    const res = await sendMessage(
      'test-session-2',
      'How does the regeneration cycle work and what salt should I use?',
      'Claude 3.5 (simulated)',
      'Maintenance'
    );

    expect(res.text).toContain('Regeneration restores the resin using brine');
    expect(res.text).toContain('Follow the unit manual for settings');
    expect(res.text).toContain('EPA WaterSense');
  }, 10000);

  it('addresses safety limits and clarifies that softening is not disinfection', async () => {
    const res = await sendMessage(
      'test-session-3',
      'Does the softener kill bacteria and make drinking water safe?',
      'Local Llama (simulated)',
      'Water basics'
    );

    expect(res.text).toContain('Softening addresses hardness');
    expect(res.text).toContain('does not establish microbiological safety');
  }, 10000);

  it('handles filename-only attachments with explicit disclaimer notice', async () => {
    const attachment = { name: 'water-test-report.pdf', size: 1048576 };
    const res = await sendMessage(
      'test-session-4',
      'Please look at my water test report for hardness level.',
      'GPT-4 (simulated)',
      'Product guidance',
      attachment
    );

    expect(res.text).toContain('Attachment noted: "water-test-report.pdf"');
    expect(res.text).toContain('this educational demo only records the file name');
    expect(res.text).toContain('File contents are not uploaded');
  }, 10000);

  it('returns educational scope fallback for out-of-scope or commercial price inquiries', async () => {
    const res = await sendMessage(
      'test-session-5',
      'What is the price of the model XYZ and can you give me a discount quote?',
      'GPT-4 (simulated)',
      'Product guidance'
    );

    expect(res.text).toContain('I am a simulated educational assistant');
    expect(res.text).toContain('I do not provide commercial price quotes');
    expect(res.text).toContain('Topics I cover');
  }, 10000);
});
