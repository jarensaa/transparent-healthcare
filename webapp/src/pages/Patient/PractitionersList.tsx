import React, { FunctionComponent, useEffect } from "react";
import { Callout, Intent } from "@blueprintjs/core";
import useEvaluationApi from "../../hooks/useEvaluationApi";

const PractitionersList: FunctionComponent = () => {
  const { getLicensesView } = useEvaluationApi();

  useEffect(() => {
    getLicensesView().then((licensens) => {
      console.log(licensens);
    });
  }, []);

  return (
    <div>
      <h2>All practitioners</h2>
      <Callout intent={Intent.DANGER}>TOOD</Callout>
    </div>
  );
};

export default PractitionersList;
