import React, { useContext, Fragment } from "react";
import KeyContext from "../../context/KeyContext";
import { Select } from "@blueprintjs/select";
import { Button, MenuItem } from "@blueprintjs/core";

const Authority = () => {
  const { keys } = useContext(KeyContext);

  const KeySelect = Select.ofType<String>();

  return (
    <Fragment>
      <h2>Authority</h2>
      <KeySelect
        items={keys}
        itemRenderer={item => <MenuItem text="key" />}
        onItemSelect={console.log}
      >
        <Button text={"select key"} />
      </KeySelect>
    </Fragment>
  );
};

export default Authority;
