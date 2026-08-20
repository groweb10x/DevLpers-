import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Agents for Developers & Freelancers | DevLpers',
  description: 'Use 12+ free AI agents — code reviewer, bug fixer, proposal writer, email writer, SEO analyzer and more. Powered by Llama 3 AI. No signup required.',
  keywords: 'ai agents, ai code reviewer, ai proposal writer, ai bug fixer, ai email writer, free ai tools for developers, freelancer ai tools, llama ai agents',
  alternates: { canonical: 'https://develpers.com/ai-agents' },
  openGraph: {
    title: 'Free AI Agents for Developers & Freelancers | DevLpers',
    description: '12+ free AI agents powered by Llama 3. Code review, bug fixing, proposals and more.',
    url: 'https://develpers.com/ai-agents',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}