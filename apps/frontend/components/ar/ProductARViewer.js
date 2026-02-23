import "@google/model-viewer";

export default function ProductARViewer({ glbUrl, usdzUrl }) {
  if (!glbUrl) {
    return (
      <div className="h-64 flex items-center justify-center text-white/60">
        3D model not available
      </div>
    );
  }

  return (
    <model-viewer
      src={glbUrl}
      ios-src={usdzUrl}
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      environment-image="neutral"
      style={{ width: "100%", height: "400px" }}
    />
  );
}