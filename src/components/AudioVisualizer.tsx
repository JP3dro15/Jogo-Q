import { useEffect, useState } from "react";

interface AudioVisualizerProps {
  isActive?: boolean;
  intensity?: "low" | "medium" | "high";
}

const AudioVisualizer = ({ isActive = true, intensity = "medium" }: AudioVisualizerProps) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const generateBars = () => {
      const barCount = 12;
      const newBars = [];
      const intensityMultiplier = intensity === "low" ? 0.5 : intensity === "high" ? 1.5 : 1;
      
      for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 40 * intensityMultiplier + 5;
        newBars.push(height);
      }
      setBars(newBars);
    };

    generateBars();
    const interval = setInterval(generateBars, 150);
    return () => clearInterval(interval);
  }, [isActive, intensity]);

  if (!isActive) return null;

  return (
    <div className="flex items-end space-x-1 h-12">
      {bars.map((height, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-primary to-secondary rounded-t-sm transition-all duration-150"
          style={{ 
            width: "3px",
            height: `${height}px`,
            boxShadow: `0 0 ${height / 4}px hsl(165 100% 45% / 0.6)`,
            animationDelay: `${index * 0.05}s`
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;