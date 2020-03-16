import React, { useState, useEffect, useContext } from "react";
import { Callout, Intent, H3 } from "@blueprintjs/core";
import { ReactComponent as DoctorImage } from "../../../images/undraw_doctor_kw5l.svg";
import useLicenseApi from "../../../hooks/useLicenseApi";
import KeyContext from "../../../context/KeyContext";
import FancyImageCard from "../../../components/FancyImageCard";

const FancyLicenseTrustedCard = () => {
  const [isTrusted, setIsTrusted] = useState<boolean>(false);
  const { isLicenseTrusted } = useLicenseApi();
  const { activeKey } = useContext(KeyContext);

  useEffect(() => {
    if (activeKey) {
      isLicenseTrusted(activeKey.address).then(setIsTrusted);
    } else {
      setIsTrusted(false);
    }
  }, [activeKey]);

  return (
    <FancyImageCard LeftImage={DoctorImage}>
      <div>
        <Callout intent={isTrusted ? Intent.SUCCESS : Intent.WARNING}>
          <H3>
            {isTrusted
              ? "You have a trusted license"
              : "Your license is not trusted"}
          </H3>
          <p>
            For your license to be trusted, it must be issued by a trusted
            License issuer. Your license must also be associated with trusted
            license provider.
          </p>
        </Callout>
      </div>
    </FancyImageCard>
  );
};

export default FancyLicenseTrustedCard;
