import Key from "./Key";

interface GeneratedKey extends Key {
  privateKey: string;
}

const isGeneratedKey = (key: Key): key is GeneratedKey => {
  if ((key as GeneratedKey).privateKey) return true;
  return false;
};

export { isGeneratedKey };
export default GeneratedKey;
