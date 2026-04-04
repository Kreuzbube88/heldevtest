export function BackgroundLogo() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        maxWidth: '80vw',
        maxHeight: '80vh',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: 'url(/logo.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
}
