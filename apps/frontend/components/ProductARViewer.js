import { useEffect } from "react";

export default function ProductARViewer({ model3dUrl, modelUsdzUrl }) {
  if (!model3dUrl && !modelUsdzUrl) {
    return (
      <div className="p-4 text-white/60 text-sm">
        AR preview not available.
      </div>
    );
  }

  return (
    <div className="mt-4">

      {/* ANDROID / DESKTOP */}
      {model3dUrl && (
        <a
          href={`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
            model3dUrl
          )}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;end;`}
          className="block w-full py-3 text-center bg-purple-600 rounded-xl mb-3"
        >
          View in AR (Android)
        </a>
      )}

      {/* IOS */}
      {modelUsdzUrl && (
        <a
          rel="ar"
          href={modelUsdzUrl}
          className="block w-full py-3 text-center bg-pink-500 rounded-xl"
        >
          View in AR (iPhone)
        </a>
      )}
    </div>
  );
}
