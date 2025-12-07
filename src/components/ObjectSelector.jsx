import React from 'react';

const objects = [
  { id: 'sphere', label: 'Sphere', icon: '🔮' },
  { id: 'cube', label: 'Cube', icon: '🧊' },
  { id: 'torus', label: 'Donut', icon: '🍩' },
];

const ObjectSelector = ({ current, onSelect, isDancing, onToggleDance, isMuted, onToggleMute, isFireworksEnabled, onToggleFireworks, isDrawingMode, onToggleDrawing }) => {
  return (
    <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '10px 20px',
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: '50px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 20,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }}>
      {/* Shape Selectors */}
      <div style={{ display: 'flex', gap: '10px', paddingRight: '20px', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
          {objects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => onSelect(obj.id)}
              style={{
                background: current === obj.id ? '#ffffff' : 'transparent',
                color: current === obj.id ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                outline: 'none'
              }}
            >
              <span>{obj.icon}</span>
              {obj.label}
            </button>
          ))}
      </div>

      {/* Dance Toggle */}
      <div style={{ display: 'flex', gap: '10px' }}>
          <button
              onClick={onToggleDance}
              style={{
                background: isDancing ? 'linear-gradient(45deg, #ff00cc, #3333ff)' : 'transparent',
                color: '#fff',
                border: isDancing ? 'none' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '20px',
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                boxShadow: isDancing ? '0 0 15px rgba(255, 0, 204, 0.5)' : 'none'
              }}
          >
              {isDancing ? '🕺 Party On!' : '💃 Dance Mode'}
          </button>

          {/* Mute Toggle */}
           <button
              onClick={onToggleMute}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={isMuted ? "Unmute" : "Mute"}
          >
              {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Fireworks/Magic Toggle */}
           <button
              onClick={onToggleFireworks}
              style={{
                background: isFireworksEnabled ? 'linear-gradient(45deg, #ffd700, #ff8c00)' : 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: isFireworksEnabled ? 'none' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isFireworksEnabled ? '0 0 10px #ffd700' : 'none'
              }}
              title={isFireworksEnabled ? "Disable Magic" : "Enable Magic"}
          >
              ✨
          </button>

          {/* Drawing Mode Toggle */}
           <button
              onClick={onToggleDrawing}
              style={{
                background: isDrawingMode ? 'linear-gradient(45deg, #00ffff, #ff00ff)' : 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: isDrawingMode ? 'none' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isDrawingMode ? '0 0 10px #00ffff' : 'none'
              }}
              title={isDrawingMode ? "Stop Drawing" : "Start Drawing"}
          >
              ✏️
          </button>
      </div>
    </div>
  );
};

export default ObjectSelector;
