import React, { useEffect, useRef, useState } from "react";
import "./Canvas.css";

interface Coordinates {
  x: number;
  y: number;
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(
    null
  );
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [previousCoords, setPreviousCoords] = useState<Coordinates | null>(
    null
  );

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasElement(canvasRef.current);
      resizeCanvas();
    }

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const resizeCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  const markCanvas = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasElement) return;

    const rect = canvasElement.getBoundingClientRect();

    const coords: Coordinates = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const canvasContext = canvasElement.getContext("2d");
    if (!canvasContext) return;

    canvasContext.beginPath();

    if (previousCoords) {
      canvasContext.moveTo(previousCoords.x, previousCoords.y);
      canvasContext.lineTo(coords.x, coords.y);
    }

    canvasContext.stroke();
    setPreviousCoords(coords);
  };

  return (
    <canvas
      ref={canvasRef}
      className="canvas"
      onMouseMove={markCanvas}
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => {
        setPreviousCoords(null);
        setIsDrawing(false);
      }}
    />
  );
}
