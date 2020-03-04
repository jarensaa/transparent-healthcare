import Key from "../types/Key";

interface KeyAuthorization extends Key {
  token: string;
}

export default KeyAuthorization;
