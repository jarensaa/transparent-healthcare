import React, { FunctionComponent } from "react";
import SidebarConfig from "../../../config/sidebar";
import routes from "../../../config/routes";
import { Button, Colors } from "@blueprintjs/core";
import { useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";

const ButtonBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 20px;
`;

const SidebarTitle = styled.h6`
  color: ${Colors.LIGHT_GRAY4};
`;

const Navigation: FunctionComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const routeMapping: Map<string, JSX.Element[]> = new Map();

  Object.values(routes).forEach(routeDefinition => {
    if (routeDefinition.sidebarArea) {
      const routeComponents =
        routeMapping.get(routeDefinition.sidebarArea) ?? [];
      const isActive = routeDefinition.path === location.pathname;
      routeComponents.push(
        <Button
          style={{
            color: Colors.LIGHT_GRAY2,
            fontWeight: isActive ? "bold" : "normal"
          }}
          minimal
          large
          key={routeDefinition.title}
          onClick={() => history.push(routeDefinition.path)}
        >
          {routeDefinition.title}
        </Button>
      );
      routeMapping.set(routeDefinition.sidebarArea, routeComponents);
    }
  });

  const sideBar = Object.entries(SidebarConfig).map(entry => (
    <div key={entry[0]}>
      <SidebarTitle className="bp3-heading">{entry[1].headerName}</SidebarTitle>
      <ButtonBlockWrapper>{routeMapping.get(entry[0])}</ButtonBlockWrapper>
    </div>
  ));

  return <div>{sideBar}</div>;
};

export default Navigation;
