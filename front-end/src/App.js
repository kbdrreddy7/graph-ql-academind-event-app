import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import MainNavigation from "./components/MainNavigation";

function App() {
  return (
    <Router>
      <Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect exact from="/" to="/auth" />
            <Route path="/auth" component={Auth} />
            <Route path="/events" component={Events} />
            <Route path="/bookings" component={Bookings} />
          </Switch>
        </main>
      </Fragment>
    </Router>
  );
}

export default App;
