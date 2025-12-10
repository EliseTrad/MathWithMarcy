import React, { useRef, useState, useEffect } from 'react';

interface HandwritingCanvasProps {
  onImageCapture: (base64Image: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Handwriting Canvas Component
 *
 * Provides a drawing canvas for handwritten input supporting:
 * - Mouse drawing
 * - Touch drawing (mobile/tablet)
 * - Clear/reset functionality
 * - Image capture as base64
 *
 * @param onImageCapture - Callback with base64 image when user submits
 * @param width - Canvas width in pixels (default: 400)
 * @param height - Canvas height in pixels (default: 200)
 * @param className - Additional CSS classes
 */
export const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({
  onImageCapture,
  width = 400,
  height = 200,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Set drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [width, height]);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x =
      'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and reset to white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Reset drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setHasDrawing(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawing) return;

    // Convert canvas to base64 PNG
    const base64Image = canvas.toDataURL('image/png');
    onImageCapture(base64Image);
  };

  return (
    <div className={`handwriting-canvas-container ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          border: '3px solid #6f4e7c',
          borderRadius: '12px',
          cursor: 'crosshair',
          touchAction: 'none',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(111, 78, 124, 0.2)',
          transition: 'all 0.3s ease',
        }}
        className={isDrawing ? 'drawing-active' : ''}
      />
      <div className="handwriting-controls mt-3 d-flex gap-2 justify-content-center">
        <button
          type="button"
          className="btn btn-outline-danger rounded-pill"
          onClick={clearCanvas}
          disabled={!hasDrawing}
        >
          🗑️ Clear
        </button>
        <button
          type="button"
          className="btn btn-primary rounded-pill"
          onClick={captureImage}
          disabled={!hasDrawing}
          style={{
            backgroundColor: '#6f4e7c',
            borderColor: '#6f4e7c',
          }}
        >
          ✨ Recognize
        </button>
      </div>
      <style>{`
        .drawing-active {
          border-color: #c83378 !important;
          box-shadow: 0 6px 12px rgba(200, 51, 120, 0.3) !important;
        }
      `}</style>
    </div>
  );
};
