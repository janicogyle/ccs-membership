import { HeroSection, FeatureList } from "@/components/organisms";
import { Card } from "@/components/molecules";
import { PageTemplate } from "@/components/templates";

export default function Home() {
  const features = [
    "Next.js App Router with JavaScript",
    "Multiple pages (Students, About, Contact)",
    "Dynamic routing for student details",
    "Modern UI with Tailwind CSS",
    "Responsive design for all devices",
    "Authentication system with MongoDB",
    "Atomic Design Pattern implementation",
    "TypeScript interfaces for type safety",
  ];

  return (
    <PageTemplate>
      <HeroSection
        title="Welcome to CCS Next.js Project"
        subtitle="Activity 3: Project Setup Using Next.js"
      />

      <main className="grid gap-6 md:grid-cols-3 mb-12">
        <Card
          href="/students"
          title="📚 Students"
          description="View the student directory and explore individual student profiles."
        />

        <Card
          href="/about"
          title="ℹ️ About"
          description="Learn more about our application and what we do."
        />

        <Card
          href="/contact"
          title="📞 Contact"
          description="Get in touch with us for any inquiries or support."
        />
      </main>

      <FeatureList features={features} />
    </PageTemplate>
  );
}
