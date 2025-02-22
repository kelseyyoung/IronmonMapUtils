import React, { useEffect } from "react";
import { EntityMarkIcon, EntityMark } from "../components";
import {
  getMarkFromStorage,
  maybeSetMarkInStorage,
  removeMarkFromStorage,
} from "../data";
import { useAppSelector } from "../state";

export const useEntityMark = (marks: EntityMarkIcon[], uniqueId: string) => {
  const [currentMarkIndex, setCurrentMarkIndex] = React.useState(
    getMarkFromStorage(uniqueId)
  );

  const { useSaveData, forceClearMarks } = useAppSelector(
    (state) => state.settings
  );

  const incrementMark = React.useCallback(() => {
    setCurrentMarkIndex((currentMarkIndex) => {
      const newMarkIndex = currentMarkIndex + 1;
      maybeSetMarkInStorage(uniqueId, newMarkIndex);
      return newMarkIndex % marks.length;
    });
  }, [marks, uniqueId]);

  useEffect(() => {
    if (useSaveData) {
      maybeSetMarkInStorage(uniqueId, currentMarkIndex);
    } else {
      removeMarkFromStorage(uniqueId);
    }
    // We don't want this to trigger when currentMarkIndex changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSaveData, uniqueId]);

  useEffect(() => {
    if (forceClearMarks > 0 && currentMarkIndex !== 0) {
      setCurrentMarkIndex(0);
      removeMarkFromStorage(uniqueId);
    }
    // We don't want this to trigger when currentMarkIndex changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceClearMarks, uniqueId]);

  return {
    currentMark: marks[currentMarkIndex],
    incrementMark,
    EntityMark,
  };
};
