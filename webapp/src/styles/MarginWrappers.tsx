import styled from "styled-components";

interface MarginWrapperProps {
  small?: boolean;
  large?: boolean;
}

const TopRightMarginWrapper = styled.div`
  margin-right: 10px;
  margin-top: 10px;
`;

const TopMarginWrapper = styled.div<MarginWrapperProps>`
  margin-top: ${(props) => (props.large ? "20px" : "10px")};
`;

const RightMarginWrapper = styled.div<MarginWrapperProps>`
  margin-right: ${(props) => (props.large ? "20px" : "10px")};
`;

const LeftMarginWrapper = styled.div<MarginWrapperProps>`
  margin-left: ${(props) => (props.large ? "20px" : "10px")};
`;

const LeftRightMarginWrapper = styled.div<MarginWrapperProps>`
  margin-left: ${(props) => (props.large ? "20px" : "10px")};
  margin-right: ${(props) => (props.large ? "20px" : "10px")};
`;

export {
  TopRightMarginWrapper,
  RightMarginWrapper,
  TopMarginWrapper,
  LeftMarginWrapper,
  LeftRightMarginWrapper,
};
