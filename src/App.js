import { Route, Switch, useLocation } from "react-router";
import Sidebar from "./Sidebar";
import Home from "./Pages/Home";
import Team from "./Pages/Team";
import Calender from "./Pages/Calender";
import Documents from "./Pages/Documents";
import Projects from "./Pages/Projects";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Doc1 from "./Doc1";
import Table1 from "./Pages/Table1";

function App() {
  const location = useLocation();
  return (
    <>
      <ResponsiveAppBar />
      <Switch location={location} key={location.pathname}>
        <Route exact path="/" component={Table1} />
        <Route exact path="/Doc1" component={Doc1} />
      </Switch>
    </>
  );
}

export default App;
