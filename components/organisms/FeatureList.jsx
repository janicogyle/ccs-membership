import { FeatureItem } from '@/components/molecules';

export default function FeatureList({ features, title }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
      {features.map((feature, index) => (
        <FeatureItem key={index} text={feature} />
      ))}
    </div>
  );
}
