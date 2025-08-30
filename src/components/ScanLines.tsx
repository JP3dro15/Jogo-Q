const ScanLines = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-5 opacity-20">
      {/* Horizontal scan lines */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-primary/30"
            style={{
              top: `${(i * 5)}%`,
              animation: `scan-flicker ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      
      {/* Moving scan line */}
      <div 
        className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent"
        style={{
          animation: 'scan-vertical 6s linear infinite'
        }}
      />
      
      {/* Vertical scan line */}
      <div 
        className="absolute w-px h-full bg-gradient-to-b from-transparent via-secondary/60 to-transparent"
        style={{
          animation: 'scan-horizontal 8s linear infinite',
          animationDelay: '2s'
        }}
      />
    </div>
  );
};

export default ScanLines;