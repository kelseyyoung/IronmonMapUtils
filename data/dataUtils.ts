import { TooltipPosition } from "../components";
import { getStorageKey } from "./storageKey";

/**
 * Bounding Box
 */
export interface BoundingBoxCoords {
  x: number;
  y: number;
}

export interface BoundingBox {
  topLeft: BoundingBoxCoords;
  topRight: BoundingBoxCoords;
  bottomRight: BoundingBoxCoords;
  bottomLeft: BoundingBoxCoords;
}

export const buildBoundingBox = (
  topLeftCoords: BoundingBoxCoords,
  width: number,
  height: number
): BoundingBox => {
  return {
    topLeft: {
      x: topLeftCoords.x,
      y: topLeftCoords.y,
    },
    topRight: {
      x: topLeftCoords.x + width,
      y: topLeftCoords.y,
    },
    bottomRight: {
      x: topLeftCoords.x + width,
      y: topLeftCoords.y + height,
    },
    bottomLeft: {
      x: topLeftCoords.x,
      y: topLeftCoords.y + height,
    },
  };
};

export const convertBoundingBoxToPolygonPoints = (box: BoundingBox) => {
  const topLeftString = `${box.topLeft.x},${box.topLeft.y}`;
  const topRightString = `${box.topRight.x},${box.topRight.y}`;
  const bottomRightString = `${box.bottomRight.x},${box.bottomRight.y}`;
  const bottomLeftString = `${box.bottomLeft.x},${box.bottomLeft.y}`;

  return `${topLeftString} ${topRightString} ${bottomRightString} ${bottomLeftString} ${topLeftString}`;
};

/**
 * Trainer
 */
export interface TrainerData {
  x: number; // x coordinate of the top-left pixel of this trainer
  y: number; // y coordinate of the top-left pixel of this trainer
  // points: string; // "points" attr for the <polygon> element
  name: string; // name of the trainer
  numPokemon: number; // number of pokemon this trainer has
  pokemonLevels: number[]; // Array of levels for the pokemon this trainer has
  walker?: boolean; // T/F if the trainer walks around
  spinner?: boolean; // T/F if the trainer is a stationary spinner
  tooltipPosition?: TooltipPosition; // Optional custom position of tooltip, to avoid overlap. Defaults to Top
}

/**
 * Item
 */
export interface ItemData {
  x: number; // x coordinate of the top-left pixel of this item
  y: number; // y coordinate of the top-left pixel of this item
  type: ItemType; // Type of the item
  spawnInfo?: string; // Special spawn rate information
}

export enum ItemType {
  Normal = 0,
  TM = 1,
  Hidden = 2,
}

/**
 * Portals
 */
export interface MapPortalData {
  portal1: BoundingBoxCoords;
  portal2: BoundingBoxCoords;
}

export type MapPortalGroup = {
  color: string;
  area: string;
  portals: MapPortalData[];
};

/**
 * Storage
 */

function verifyLocalStorage() {
  if (!window.localStorage) {
    console.warn("[Ironmon Map] localStorage unavailable");
  }
}

export function setUseSaveDataInStorage(saveData: boolean): void {
  verifyLocalStorage();

  window.localStorage.setItem(
    `${getStorageKey()}_UseStorageKey`,
    `${saveData}`
  );
}

export function getUseSaveDataFromStorage(): boolean {
  verifyLocalStorage();
  const storedValue = window.localStorage.getItem(
    `${getStorageKey()}_UseStorageKey`
  );
  if (storedValue) {
    return storedValue === "true";
  }
  return false;
}

function getMarksMapFromStorage(): Record<string, number> {
  const storedMap = window.localStorage.getItem(`${getStorageKey()}_MarksMap`);
  if (!storedMap) {
    return {};
  }
  return JSON.parse(storedMap);
}

export function maybeSetMarkInStorage(id: string, markIndex: number): void {
  verifyLocalStorage();

  if (!getUseSaveDataFromStorage()) {
    return;
  }

  const marksSet = getMarksMapFromStorage();
  if (markIndex !== 0) {
    marksSet[id] = markIndex;
  } else {
    delete marksSet[id];
  }

  window.localStorage.setItem(
    `${getStorageKey()}_MarksMap`,
    `${JSON.stringify(marksSet)}`
  );
}

export function removeMarkFromStorage(id: string): void {
  const marksSet = getMarksMapFromStorage();
  delete marksSet[id];
  window.localStorage.setItem(
    `${getStorageKey()}_MarksMap`,
    `${JSON.stringify(marksSet)}`
  );
}

export function getMarkFromStorage(id: string): number {
  verifyLocalStorage();

  const marksSet = getMarksMapFromStorage();
  return marksSet[id] ?? 0;
}
