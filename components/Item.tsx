import { ItemData, ItemType } from "../data";
import { Tooltip } from "./Tooltip";
import "./Item.css";
import { useEntityMark, useHoverableTooltip } from "../hooks";
import { InteractablePolygon } from "./InteractablePolygon";
import React from "react";
import { EntityMarkIcon } from "./EntityMark";
import { useAppSelector } from "../state";
import { DEBUG_MODE } from "../utils/debugMode";

export interface ItemProps extends ItemData {
  height: number;
  width: number;
}

// TODO: Memoize?
const convertItemTypeToClassName = (itemType: ItemType) => {
  switch (itemType) {
    case ItemType.Normal:
      return "normal";
    case ItemType.TM:
      return "tm";
    case ItemType.Hidden:
      return "hidden";
    default:
      return "";
  }
};

export const Item = (props: ItemProps) => {
  const { x, y, height, width, spawnInfo, type } = props;
  const uniqueId = `Item_${x}_${y}_${type}`;
  const marks = React.useRef<EntityMarkIcon[]>([
    "none",
    "checked",
    "crossed",
    "starred",
  ]);

  const {
    showItemData: showTooltip,
    highlightItems,
    highlightHiddenItems,
    highlightTMs,
  } = useAppSelector((state) => state.settings);

  const highlight = React.useMemo(() => {
    if (type === ItemType.Normal && highlightItems) {
      return true;
    } else if (type === ItemType.TM && highlightTMs) {
      return true;
    } else if (type === ItemType.Hidden && highlightHiddenItems) {
      return true;
    }
    return false;
  }, [type, highlightItems, highlightTMs, highlightHiddenItems]);

  const { currentMark, incrementMark, EntityMark } = useEntityMark(
    marks.current,
    uniqueId
  );

  const { shouldShowTooltip, showTooltipOnHover, hideTooltipOnHover } =
    useHoverableTooltip(showTooltip);

  return (
    <>
      <InteractablePolygon
        onClick={incrementMark}
        onMouseEnter={showTooltipOnHover}
        onMouseLeave={hideTooltipOnHover}
        x={x}
        y={y}
        height={height}
        width={width}
      >
        <foreignObject
          x={x - 2}
          y={y - 2}
          width={16}
          height={16}
          style={{ overflow: "visible" }}
        >
          <span
            className={`${
              highlight ? "highlight" : ""
            } ${convertItemTypeToClassName(type)}`}
          ></span>
        </foreignObject>
        <EntityMark x={x + 1} y={y} size={12} mark={currentMark} />
      </InteractablePolygon>
      {(spawnInfo || DEBUG_MODE) && (
        <Tooltip
          x={x}
          y={y}
          show={shouldShowTooltip}
          targetWidth={width}
          targetHeight={height}
        >
          <div>{spawnInfo}</div>
        </Tooltip>
      )}
    </>
  );
};
