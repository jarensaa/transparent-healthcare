import React, { ReactNode, Component, Fragment } from "react";
import { FunctionComponent } from "react";
import styled, { css } from "styled-components";
import { Card, Colors } from "@blueprintjs/core";
import FlexRow from "../styles/FlexRow";

interface ICardWrapperProps {
  standardWidth?: boolean;
}

const Wrapper = styled.div<ICardWrapperProps>`
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 900px;
  display: grid;

  ${props =>
    props.standardWidth &&
    css`
      width: 100%;
      max-width: 900px;
    `}
`;

const CardWrapper = styled.div`
  grid-area: 1/1;
`;

const Overlay = styled.div`
  background-color: ${Colors.LIGHT_GRAY3};
  width: 100%;
  height: 100%;
  grid-area: 1/1;
  opacity: 0.5;
  cursor: not-allowed;
  z-index: 1;
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
  disabled?: boolean;
}

const FancyImageCard: FunctionComponent<FancyCardProps> = ({
  children,
  LeftImage,
  imageAlignment,
  small,
  standardWidth,
  disabled
}) => {
  return (
    <Wrapper standardWidth={standardWidth}>
      <CardWrapper>
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
      {disabled ? <Overlay /> : <Fragment />}
    </Wrapper>
  );
};

export default FancyImageCard;
