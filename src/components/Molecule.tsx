import { cn } from "@/lib/utils";

interface MoleculeProps {
  type: "H2O" | "CO2" | "NH3" | "CH4";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Molecule = ({ type, size = "md", className }: MoleculeProps) => {
  const sizeMap = {
    sm: { container: "w-16 h-16", atom: { main: 6, secondary: 4 } },
    md: { container: "w-24 h-24", atom: { main: 8, secondary: 6 } },
    lg: { container: "w-32 h-32", atom: { main: 12, secondary: 8 } }
  };
  
  const { container, atom } = sizeMap[size];

  const renderMolecule = () => {
    switch (type) {
      case "H2O":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Oxygen (red, center) */}
            <circle cx="50" cy="50" r={atom.main} fill="hsl(0 100% 60%)" className="terminal-glow" />
            
            {/* Hydrogen atoms (white) */}
            <circle cx="25" cy="35" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            <circle cx="75" cy="35" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            
            {/* Bonds */}
            <line x1="50" y1="50" x2="25" y2="35" stroke="hsl(165 100% 45%)" strokeWidth="2" className="terminal-glow" />
            <line x1="50" y1="50" x2="75" y2="35" stroke="hsl(165 100% 45%)" strokeWidth="2" className="terminal-glow" />
          </svg>
        );
        
      case "CO2":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Carbon (gray, center) */}
            <circle cx="50" cy="50" r={atom.main} fill="hsl(0 0% 40%)" className="terminal-glow" />
            
            {/* Oxygen atoms (red) */}
            <circle cx="20" cy="50" r={atom.secondary} fill="hsl(0 100% 60%)" className="danger-glow" />
            <circle cx="80" cy="50" r={atom.secondary} fill="hsl(0 100% 60%)" className="danger-glow" />
            
            {/* Bonds */}
            <line x1="50" y1="50" x2="20" y2="50" stroke="hsl(165 100% 45%)" strokeWidth="2" />
            <line x1="50" y1="50" x2="80" y2="50" stroke="hsl(165 100% 45%)" strokeWidth="2" />
          </svg>
        );
        
      case "NH3":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Nitrogen (blue, center) */}
            <circle cx="50" cy="50" r={atom.main} fill="hsl(240 100% 60%)" className="terminal-glow" />
            
            {/* Hydrogen atoms (white) */}
            <circle cx="30" cy="30" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            <circle cx="70" cy="30" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            <circle cx="50" cy="75" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            
            {/* Bonds */}
            <line x1="50" y1="50" x2="30" y2="30" stroke="hsl(165 100% 45%)" strokeWidth="2" />
            <line x1="50" y1="50" x2="70" y2="30" stroke="hsl(165 100% 45%)" strokeWidth="2" />
            <line x1="50" y1="50" x2="50" y2="75" stroke="hsl(165 100% 45%)" strokeWidth="2" />
          </svg>
        );
        
      case "CH4":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Carbon (gray, center) */}
            <circle cx="50" cy="50" r={atom.main} fill="hsl(0 0% 40%)" className="terminal-glow" />
            
            {/* Hydrogen atoms (white) */}
            <circle cx="30" cy="30" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            <circle cx="70" cy="30" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            <circle cx="30" cy="70" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            <circle cx="70" cy="70" r={atom.secondary} fill="hsl(0 0% 90%)" className="lab-glow" />
            
            {/* Bonds */}
            <line x1="50" y1="50" x2="30" y2="30" stroke="hsl(165 100% 45%)" strokeWidth="2" />
            <line x1="50" y1="50" x2="70" y2="30" stroke="hsl(165 100% 45%)" strokeWidth="2" />
            <line x1="50" y1="50" x2="30" y2="70" stroke="hsl(165 100% 45%)" strokeWidth="2" />
            <line x1="50" y1="50" x2="70" y2="70" stroke="hsl(165 100% 45%)" strokeWidth="2" />
          </svg>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={cn(container, "flex items-center justify-center", className)}>
      {renderMolecule()}
    </div>
  );
};

export default Molecule;