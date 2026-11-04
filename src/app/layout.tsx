import type { Metadata } from 'next';
import '../index.css';
export const metadata: Metadata = { title: 'SoftWater Assist', description: 'Water softener education — simulated educational assistant' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
