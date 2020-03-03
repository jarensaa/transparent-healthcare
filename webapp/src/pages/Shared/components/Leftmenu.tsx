import React, { useContext } from "react";

import { useHistory, useLocation } from "react-router-dom";
import routes from "../../../config/routes";
import styled from "styled-components";
import { Button, Colors, Switch } from "@blueprintjs/core";
import KeyContext from "../../../context/KeyContext";

const LeftMenuContainer = styled.div`
  background-color: ${Colors.DARK_GRAY5};
  padding-left: 30px;
  padding-top: 100px;
`;

const ButtonWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AdminToggleWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  padding-left: 15px;
  color: ${Colors.LIGHT_GRAY2};
`;

const LeftMenu = () => {
  const history = useHistory();
  const location = useLocation();
  const { isOriginalAuthority, toggleIsAuthority } = useContext(KeyContext);

  const handleClick = (path: string) => {
    history.push(path);
  };

  return (
    <LeftMenuContainer>
      <ButtonWrapper>
        {routes
          .filter(item => item.showInSidebar)
          .map(item => (
            <Button
              style={{ color: Colors.LIGHT_GRAY2 }}
              minimal
              large
              key={item.title}
              className={`item ${
                item.path === location.pathname ? "active" : ""
              }`}
              onClick={() => handleClick(item.path)}
            >
              {item.title}
            </Button>
          ))}
      </ButtonWrapper>
      <AdminToggleWrapper>
        <Switch
          large
          checked={isOriginalAuthority}
          onChange={toggleIsAuthority}
        >
          Admin mode
        </Switch>
      </AdminToggleWrapper>
    </LeftMenuContainer>
  );
};

export default LeftMenu;
