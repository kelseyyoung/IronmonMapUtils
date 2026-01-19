export function getStorageKey() {
  // if (!(window as any).ironmonMapStorageKey) {
  //   console.log("No ironmon map storage key found!");
  // }
  return (window as any).ironmonMapStorageKey;
}
