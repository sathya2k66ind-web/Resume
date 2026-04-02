import Hero from "@/components/ui/animated-shader-hero";

// Demo Component showing how to use the Hero
const AnimatedShaderHeroDemo: React.FC = () => {
  const handlePrimaryClick = () => {
    console.log('Get Started clicked!');
  };

  const handleSecondaryClick = () => {
    console.log('Learn More clicked!');
  };

  return (
    <div className="w-full">
      <Hero
        trustBadge={{
          text: "Trusted by forward-thinking teams.",
          icons: ["✨"]
        }}
        headline={{
          line1: "Launch Your",
          line2: "Potential Into Orbit"
        }}
        subtitle="Build the future with cutting-edge tech and AI-powered automation. Fast, seamless, and limitless."
        buttons={{
          primary: {
            text: "Get Started for Free",
            onClick: handlePrimaryClick
          },
          secondary: {
            text: "Learn More",
            onClick: handleSecondaryClick
          }
        }}
      />
      
      {/* Additional content below hero */}
      <div className="bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">
            Component Features
          </h2>
          <div className="bg-gray-900 p-6 rounded-lg border border-cyan-500/20">
            <ul className="space-y-3 text-cyan-100/80">
              <li>✨ WebGL shader background with interactive effects</li>
              <li>🎨 Fully customizable with cool blue/cyan color scheme</li>
              <li>📱 Responsive design for all screen sizes</li>
              <li>⚡ Smooth animations with staggered delays</li>
              <li>🎯 Trust badges, headlines, subtitles, and CTA buttons</li>
              <li>🖱️ Pointer tracking and mouse interaction support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedShaderHeroDemo;
