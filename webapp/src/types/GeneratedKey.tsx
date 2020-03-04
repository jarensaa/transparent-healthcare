import Key from "./Key";

interface GeneratedKey extends Key {
  address: string;
  privateKey: string;
  description?: string;
}

export default GeneratedKey;
