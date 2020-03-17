import React, { ReactNode, Component } from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { Card } from "@blueprintjs/core";
import FlexRow from "../styles/FlexRow";

type ImageAlignment = "flex-start" | "flex-end" | "center";

interface FancyCardProps {
  LeftImage: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  imageAlignment?: ImageAlignment;
}

interface IImageWrapperProps {
  imageAlignment?: ImageAlignment;
}

const CardWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 900px;
`;

const ContentArea = styled.div`
  padding: 20px 30px;
  gap: 50px;
  display: grid;
  grid-template-columns: 200px auto;
`;

const ImageWrapper = styled.div<IImageWrapperProps>`
  align-self: ${props =>
    props.imageAlignment ? props.imageAlignment : "center"};
`;

const FancyImageCard: FunctionComponent<FancyCardProps> = ({
  children,
  LeftImage,
  imageAlignment
}) => {
  return (
    <CardWrapper>
      <Card>
        <ContentArea>
          <FlexRow>
            <ImageWrapper imageAlignment={imageAlignment}>
              <LeftImage style={{ height: "100%", width: "100%" }} />
            </ImageWrapper>
          </FlexRow>
          <div>{children}</div>
        </ContentArea>
      </Card>
    </CardWrapper>
  );
};

export default FancyImageCard;
