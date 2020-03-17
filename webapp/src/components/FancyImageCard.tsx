import React, { ReactNode, Component } from "react";
import { FunctionComponent } from "react";
import styled, { css } from "styled-components";
import { Card } from "@blueprintjs/core";
import FlexRow from "../styles/FlexRow";

interface ICardWrapperProps {
  standardWidth?: boolean;
}

const CardWrapper = styled.div<ICardWrapperProps>`
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 900px;

  ${props =>
    props.standardWidth &&
    css`
      width: 100%;
      max-width: 900px;
    `}
`;

interface IContentAreaProps {
  small?: boolean;
}

const ContentArea = styled.div<IContentAreaProps>`
  padding: 20px 30px;
  gap: 50px;
  display: grid;
  grid-template-columns: ${props => (props.small ? "140px" : "200px")} auto;
`;

type ImageAlignment = "flex-start" | "flex-end" | "center";

interface IImageWrapperProps {
  imageAlignment?: ImageAlignment;
}

const ImageWrapper = styled.div<IImageWrapperProps>`
  align-self: ${props =>
    props.imageAlignment ? props.imageAlignment : "center"};
`;

interface FancyCardProps {
  LeftImage: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  imageAlignment?: ImageAlignment;
  small?: boolean;
  standardWidth?: boolean;
}

const FancyImageCard: FunctionComponent<FancyCardProps> = ({
  children,
  LeftImage,
  imageAlignment,
  small,
  standardWidth
}) => {
  return (
    <CardWrapper standardWidth={standardWidth}>
      <Card>
        <ContentArea small={small}>
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
