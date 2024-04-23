import React from "react";
import * as ReactDOM from "react-dom";
import { DEBUG_MODE } from "../utils/debugMode";
import "./Tooltip.css";

export enum TooltipPosition {
  Top = "Top",
  Right = "Right",
  Bottom = "Bottom",
  Left = "Left",
}

export interface TooltipProps {
  x: number;
  y: number;
  targetWidth: number;
  targetHeight: number;
  show: boolean;
  children: React.ReactNode;
  tooltipPosition?: TooltipPosition;
}

const getTooltipPosition = (
  tooltipPostion: TooltipPosition,
  x: number,
  y: number,
  targetWidth: number,
  targetHeight: number,
  width?: number,
  height?: number
): { x: number; y: number } => {
  let positionX = x;
  let positionY = y;
  switch (tooltipPostion) {
    case TooltipPosition.Top:
      positionX = width ? x - (width / 2 - targetWidth / 2) : x;
      positionY = height ? y - height : y;
      break;
    case TooltipPosition.Bottom:
      positionX = width ? x - (width / 2 - targetWidth / 2) : x;
      positionY = height ? y + targetHeight : y;
      break;
    case TooltipPosition.Right:
      positionX = width ? x + targetWidth : x;
      positionY = height ? y - (height / 2 - targetHeight / 2) : y;
      break;
    case TooltipPosition.Left:
      positionX = width ? x - width : x;
      positionY = height ? y - (height / 2 - targetHeight / 2) : y;
      break;
  }
  return { x: positionX, y: positionY };
};

export const Tooltip = (props: TooltipProps) => {
  const {
    x,
    y,
    show,
    children,
    targetWidth,
    targetHeight,
    tooltipPosition = TooltipPosition.Top,
  } = props;
  const el = React.useRef(document.createElement("div"));

  const [zIndex, setZIndex] = React.useState(1000);
  const tooltipContainerRef = React.useRef<HTMLDivElement | null>(null);

  const tooltipHeight = tooltipContainerRef.current?.offsetHeight;
  const tooltipWidth = tooltipContainerRef.current?.offsetWidth;
  const { x: tooltipXPosition, y: tooltipYPosition } = getTooltipPosition(
    tooltipPosition,
    x,
    y,
    targetWidth,
    targetHeight,
    tooltipWidth,
    tooltipHeight
  );

  React.useEffect(() => {
    const tooltipContainer = document.getElementById("tooltip-container");
    const currentEl = el.current;
    tooltipContainer?.appendChild(currentEl);

    return () => {
      tooltipContainer?.removeChild(currentEl);
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      style={{
        top: tooltipYPosition,
        left: tooltipXPosition,
        visibility: show ? "visible" : "hidden",
        zIndex,
      }}
      ref={tooltipContainerRef}
      className={`tooltip ${tooltipPosition}`}
      onMouseEnter={() => {
        setZIndex(1001);
      }}
      onMouseLeave={() => {
        setZIndex(1000);
      }}
    >
      {DEBUG_MODE && (
        <span>
          X: {x}, Y: {y}
        </span>
      )}
      {children}
      {/* <div className={`tooltip-beak ${tooltipPosition}`}></div> */}
    </div>,
    el.current
  );
};
