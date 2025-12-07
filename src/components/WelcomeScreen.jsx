import React, { useState } from 'react';

const WelcomeScreen = ({ onEnter }) => {
  const [loading, setLoading] = useState(false);

  const handleEnter = () => {
    setLoading(true);
    // Add a small artificial delay for the "loader" feel if starting up is too fast,
    // or just pass through.
    onEnter();
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      color: 'white',
      fontFamily: '"Arial", sans-serif'
    }}>
      {/* Background Elements */}
      <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,0,255,0.2) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          animation: 'pulse 3s infinite ease-in-out'
      }}></div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff; }
          50% { box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff; }
          100% { box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff; }
        }
      `}</style>

      <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '5px',
          zIndex: 2,
          textShadow: '0 0 10px rgba(255,255,255,0.5)'
      }}>
        Hand Tracking <span style={{ color: '#ff00ff' }}>Party</span>
      </h1>

      <p style={{
          maxWidth: '400px',
          textAlign: 'center',
          opacity: 0.7,
          marginBottom: '3rem',
          lineHeight: '1.6',
          zIndex: 2
      }}>
        Allow camera access to interact with the 3D world using your hands.
        Your video is processed locally and never sent to a server.
      </p>

      {!loading ? (
        <button
          onClick={handleEnter}
          style={{
            padding: '15px 40px',
            fontSize: '1.2rem',
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 2,
            position: 'relative',
            overflow: 'hidden',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            animation: 'glow 2s infinite'
          }}
          onMouseEnter={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = 'black';
          }}
          onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
          }}
        >
          Enter Experience
        </button>
      ) : (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255,255,255,0.3)',
                borderTop: '4px solid #ff00ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>Initializing Camera...</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
