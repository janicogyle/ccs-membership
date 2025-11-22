import { FeatureItem } from '@/components/molecules';

export default function FeatureList({ features, title = 'Project Features' }) {
  return (
    <section className="bg-black text-white rounded-lg shadow-lg p-8 mb-12 border-l-4 border-orange-500">
      <h2 className="text-3xl font-bold mb-4">
        {title}
      </h2>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <FeatureItem key={index} icon="✓" text={feature} />
        ))}
      </ul>
    </section>
  );
}
