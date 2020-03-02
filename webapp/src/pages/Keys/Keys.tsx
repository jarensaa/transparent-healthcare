import React, { useContext, FunctionComponent, Fragment } from "react";
import KeyContext from "../../context/KeyContext";
import { Button } from "@blueprintjs/core";

const Keys: FunctionComponent = () => {
  const { keys, addKey } = useContext(KeyContext);

  const keyListing = keys.map((key, index) => <p key={index}>{key}</p>);

  return (
    <Fragment>
      <h2>Keys</h2>
      {keyListing}
      <Button onClick={() => addKey("test")}>Add a key</Button>
    </Fragment>
  );
};

export default Keys;
