import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import '../style/StreetViewModal.css';
import { olaConfig } from '../config/olaMaps';

// Reliable Public 360 Image (Pannellum)
const DEMO_IMAGE_URL = "https://pannellum.org/images/alma.jpg";

const StreetViewModal = ({ isOpen, onClose, imageSrc, title, lat, lng, embedUrl }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null); // 🟢 Store loaded image
  const [currentImage, setCurrentImage] = useState(imageSrc);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Track readiness
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset state
  useEffect(() => {
    if (isOpen) {
      setRotation({ x: 0, y: 0 });
      setError(null);
      setIsDragging(false);
      setIsDemo(false);
      setIsImageLoaded(false);
      imageRef.current = null;
    }
  }, [isOpen]);

  // Load Image Effect - Runs ONLY when currentImage changes
  useEffect(() => {
    if (!currentImage || embedUrl) return; // Skip if using embed

    setIsImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentImage;

    img.onload = () => {
      console.log("[OlaView] Image loaded successfully:", currentImage);
      imageRef.current = img;
      setIsImageLoaded(true);
    };

    img.onerror = (e) => {
      console.error("[OlaView] Image failed to load:", currentImage, e);
      if (!isDemo && currentImage !== DEMO_IMAGE_URL) {
        // Fallback to demo if main image fails
        setCurrentImage(DEMO_IMAGE_URL);
        setIsDemo(true);
      }
    };
  }, [currentImage, isDemo, embedUrl]);


  // Fetch Ola Maps Data
  useEffect(() => {
    if (!isOpen || embedUrl) return; // 🟢 Skip fetch if embed exists

    const fetchOlaView = async () => {
      if (lat && lng) {
        setLoading(true);
        setError(null);
        console.log(`[OlaView] Fetching for [${lat}, ${lng}]`);

        try {
          // Step 1: Get Image ID
          const idUrl = `https://api.olamaps.io/sli/streetview/imageId?lat=${lat}&lon=${lng}&api_key=${olaConfig.apiKey}`;
          const idResponse = await fetch(idUrl);

          if (!idResponse.ok) {
            throw new Error(`API Connection Failed (${idResponse.status})`);
          }

          const idData = await idResponse.json();
          const imageId = idData.imageId || idData.id;

          if (!imageId) throw new Error("No Street View available here");

          // Step 2: Get Metadata
          const metaUrl = `https://api.olamaps.io/sli/streetview/metadata?imageId=${imageId}&api_key=${olaConfig.apiKey}`;
          const metaResponse = await fetch(metaUrl);
          if (!metaResponse.ok) throw new Error("Failed to load metadata");

          const metaData = await metaResponse.json();
          const streetViewUrl = metaData.imageUrl || metaData.url;

          if (streetViewUrl) {
            setCurrentImage(streetViewUrl);
            setIsDemo(false);
          } else {
            throw new Error("No image URL found");
          }

        } catch (err) {
          console.warn("[OlaView] Fetch failed, switching to Demo Mode:", err);
          // 🟢 Fallback to Demo 360 Image instead of flat image
          setCurrentImage(DEMO_IMAGE_URL);
          setIsDemo(true);
          setError(err.message); // Set error message from fetch failure
        } finally {
          setLoading(false);
        }
      } else {
        // Static/Demo Mode
        setCurrentImage(DEMO_IMAGE_URL);
        setIsDemo(true);
      }
    };

    fetchOlaView();
  }, [isOpen, lat, lng, imageSrc]);

  // Unified Drawing Logic - Runs on Animation Frame
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current || !isImageLoaded) return;

    const ctx = canvas.getContext('2d');
    const img = imageRef.current; // Use PRELOADED image

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Panoramic Projection Math
    const offsetX = (rotation.y / 180) * (img.width - width);
    const offsetY = (rotation.x / 90) * (img.height - height);

    ctx.save();
    // Center and scale slightly to cover edges
    const scale = 1.0;
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);

    // Simple perspective simulation
    // Note: A true equirectangular-to-rectilinear shader is complex for 2D canvas.
    // This simple transform gives a "pan-able" window effect which is efficient.

    ctx.drawImage(
      img,
      Math.max(0, Math.min(offsetX + (img.width / 2 - width / 2), img.width - width)), // Source X (centered)
      Math.max(0, Math.min(offsetY + (img.height / 2 - height / 2), img.height - height)), // Source Y (centered)
      width,
      height,
      -width / 2,
      -height / 2,
      width,
      height
    );
    ctx.restore();

    // 🟢 Add Demo Watermark if in Demo Mode
    if (isDemo) {
      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.textAlign = "right";
      ctx.fillText("Start 360° Demo Mode", width - 20, height - 20);
    }
  }, [rotation, isImageLoaded, isDemo]);

  // Trigger draw on changes
  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame for smoother updates
      const rAF = requestAnimationFrame(drawScene);
      return () => cancelAnimationFrame(rAF);
    }
  }, [drawScene, isOpen]);

  // Mouse Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotation((prev) => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.5) % 360,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="street-view-modal-overlay" onClick={onClose}>
      <div className="street-view-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="street-view-header ola-header">
          <div className="ola-brand">
            <span className="ola-logo-text">Ola Maps</span>
            <span className="divider">|</span>
            {/* 🟢 Status Indicator */}
            {embedUrl ? (
              <span style={{ color: '#38bdf8', fontSize: '0.8rem', border: '1px solid #38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
                AIRPANO 360
              </span>
            ) : isDemo ? (
              <span style={{ color: '#facc15', fontSize: '0.8rem', border: '1px solid #facc15', padding: '2px 6px', borderRadius: '4px' }}>
                DEMO VIEW
              </span>
            ) : (
              <span style={{ color: '#4ade80', fontSize: '0.8rem', border: '1px solid #4ade80', padding: '2px 6px', borderRadius: '4px' }}>
                LIVE
              </span>
            )}
            <h2 style={{ marginLeft: '10px' }}>{title}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 🟢 Iframe Mode */}
        {embedUrl ? (
          <div className="street-view-iframe-wrapper" style={{ width: '100%', height: 'calc(100% - 60px)', position: 'relative' }}>
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              allowFullScreen
              style={{ border: 'none', borderRadius: '0 0 12px 12px' }}
            ></iframe>
          </div>
        ) : (
          // 🟢 Canvas Mode (Existing)
          <>
            <div
              className="street-view-canvas-wrapper"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                  <div className="text-lime-400 font-bold animate-pulse">Fetching Ola Street View...</div>
                </div>
              )}

              {error && !loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 flex-col gap-2">
                  <div className="text-red-400 font-bold text-lg">Signal Lost</div>
                  <div className="text-gray-400 text-sm">{error}</div>
                </div>
              )}

              <canvas
                ref={canvasRef}
                className="street-view-canvas"
                width={1000}
                height={600}
              />

              <div className="street-view-hint">
                <p>🖱️ Drag to explore • Scroll to zoom</p>
              </div>
            </div>

            <div className="street-view-controls">
              <div className="rotation-display">
                <span>X: {rotation.x.toFixed(0)}°</span>
                <span>Y: {rotation.y.toFixed(0)}°</span>
              </div>
              <button
                className="reset-btn"
                onClick={() => setRotation({ x: 0, y: 0 })}
              >
                Reset View
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StreetViewModal;
