import React, { Fragment } from "react";
import LeftMenu from "./Leftmenu";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routes from "../../../utils/routes";
import styled from "styled-components";
import Keys from "../../Keys/Keys";

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
    <Route exact key={route.path} path={route.path}>
      {route.Component({ children: <Fragment /> })}
    </Route>
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
