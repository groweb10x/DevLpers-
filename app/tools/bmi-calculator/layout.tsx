import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free BMI Calculator Online — Check Your Body Mass Index (kg/cm) | DevLpers',
  description: 'Calculate your BMI instantly using kg/cm or lbs/inches. Get your weight category (underweight, normal, overweight, obese) based on WHO standards. Free, no signup.',
  keywords: 'bmi calculator, bmi calculator kg cm, body mass index calculator, bmi calculator free online, check my bmi, bmi calculator for men, bmi calculator for women, ideal weight calculator',
  alternates: { canonical: 'https://www.develpers.com/tools/bmi-calculator' },
  openGraph: {
    title: 'Free BMI Calculator — Check Your Body Mass Index Instantly',
    description: 'Calculate BMI in kg/cm or lbs/inches. Free, instant, WHO-standard weight categories.',
    url: 'https://www.develpers.com/tools/bmi-calculator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}