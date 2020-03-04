import Key from "../types/Key";

interface AuthorizationKey extends Key {
  token: string;
}

const isAuthorizationKey = (key: Key | undefined): key is AuthorizationKey => {
  if ((key as AuthorizationKey).token) return true;
  return false;
};

export { isAuthorizationKey };
export default AuthorizationKey;
