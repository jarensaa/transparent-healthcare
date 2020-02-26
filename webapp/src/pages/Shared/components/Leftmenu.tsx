import React from "react";

import { useHistory, useLocation } from "react-router-dom";
import routes from "../../../utils/routes";
import styled from "styled-components";
import { Button, Colors } from "@blueprintjs/core";

const LeftMenuContainer = styled.div`
  background-color: ${Colors.DARK_GRAY5};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 30px;
  padding-top: 100px;
`;

const LeftMenu = () => {
  const history = useHistory();
  const location = useLocation();

  const handleClick = (path: string) => {
    history.push(path);
  };

  return (
    <LeftMenuContainer>
      {routes.map(item => (
        <Button
          style={{ color: Colors.LIGHT_GRAY2 }}
          minimal
          large
          key={item.title}
          className={`item ${item.path === location.pathname ? "active" : ""}`}
          onClick={() => handleClick(item.path)}
        >
          {item.title}
        </Button>
      ))}
    </LeftMenuContainer>
  );
};

export default LeftMenu;
