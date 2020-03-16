import React, { ReactNode, Component } from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { Card } from "@blueprintjs/core";

interface FancyCardProps {
  LeftImage: FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const CardWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 900px;
`;

const ContentArea = styled.div`
  padding-left: 30px;
  padding-right: 30px;
  gap: 50px;
  display: grid;
  grid-template-columns: 200px auto;
`;

const ImageWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const FancyImageCard: FunctionComponent<FancyCardProps> = ({
  children,
  LeftImage
}) => {
  return (
    <CardWrapper>
      <Card>
        <ContentArea>
          <ImageWrapper>
            <LeftImage style={{ height: "100%", width: "100%" }} />
          </ImageWrapper>
          {children}
        </ContentArea>
      </Card>
    </CardWrapper>
  );
};

export default FancyImageCard;
