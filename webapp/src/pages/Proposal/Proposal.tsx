import React, { Component } from "react";
import { useLocation } from "react-router-dom";

const Proposal = (): JSX.Element => {
  const location = useLocation();

  console.log(location);

  return <h2>Proposal</h2>;
};

export default Proposal;
