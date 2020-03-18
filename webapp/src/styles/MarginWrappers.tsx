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
  margin-top: ${props => (props.large ? "20px" : "10px")};
`;

export { TopRightMarginWrapper, TopMarginWrapper };
