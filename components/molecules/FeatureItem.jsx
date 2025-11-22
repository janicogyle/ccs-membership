

export default function FeatureItem({ icon, text }) {
  return (
    <li className="flex items-start">
      <span className="text-orange-500 mr-2">{icon}</span>
      <span>{text}</span>
    </li>
  );
}
