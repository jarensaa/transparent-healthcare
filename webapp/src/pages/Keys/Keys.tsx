import React, { useContext, FunctionComponent, Fragment } from "react";
import KeyContext from "../../context/KeyContext";
import Key from "../../dto/Key";
import { Button } from "@blueprintjs/core";

const Keys: FunctionComponent = () => {
  const { keys, addKey } = useContext(KeyContext);

  console.log("Render key panel");

  let keyList: Key[] = [];

  keys.forEach(key => keyList.push(key));

  const keyListing = keyList.map((key, index) => (
    <p key={index}>{key.address}</p>
  ));

  return (
    <Fragment>
      <h2>Keys</h2>
      {keyListing}
      <Button
        onClick={() =>
          addKey({
            address: "1234",
            privateKey: "private123",
            publicKey: "public123"
          })
        }
      >
        Add a key
      </Button>
    </Fragment>
  );
};

export default Keys;
