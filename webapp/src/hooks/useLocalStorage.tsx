import TreatmentKey from "../types/TreatmentKey";

const addTreatmentKeyToLocalStorage = (key: TreatmentKey) => {
  const existingKeys = getTreatmentKeysFromLocalStorage();
  const newKeys = [...existingKeys, key];
  localStorage.setItem("treatmentKeys", JSON.stringify(newKeys));
};

const getTreatmentKeysFromLocalStorage = (): TreatmentKey[] => {
  const keysString = localStorage.getItem("treatmentKeys");

  const keys: TreatmentKey[] = keysString ? JSON.parse(keysString) : [];
  return keys;
};

const getTreatmentKeysMapFromLocalStorage = (): Map<String, TreatmentKey> => {
  const treatmentKeys: TreatmentKey[] = getTreatmentKeysFromLocalStorage();
  return treatmentKeys.reduce((map, key) => {
    return map.set(key.address.toLowerCase(), key);
  }, new Map<String, TreatmentKey>());
};

const useLocalStorage = () => {
  return {
    addTreatmentKeyToLocalStorage,
    getTreatmentKeysFromLocalStorage,
    getTreatmentKeysMapFromLocalStorage
  };
};

export default useLocalStorage;
