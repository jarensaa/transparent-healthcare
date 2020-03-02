import React from "react";
import LeftMenu from "./Leftmenu";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routes from "../../../config/routes";
import styled from "styled-components";

const StyledLayout = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 300px auto;
`;

const MainArea = styled.div`
  background-color: #f5f8fa;
  padding-top: 50px;
  padding-left: 100px;
`;

const Layout = () => {
  const pages = routes.map(route => (
    <Route
      exact
      key={route.path}
      path={route.path}
      component={route.Component}
    ></Route>
  ));

  return (
    <BrowserRouter>
      <StyledLayout>
        <LeftMenu></LeftMenu>
        <MainArea>
          <Switch>{pages}</Switch>
        </MainArea>
      </StyledLayout>
    </BrowserRouter>
  );
};

export default Layout;
