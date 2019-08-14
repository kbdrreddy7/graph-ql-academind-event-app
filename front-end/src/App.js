import React, { Fragment, Component } from "react";
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

import AuthContext from "./context/auth-context";

class App extends Component {
  state = {
    token: "",
    userId: ""
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
    console.log(" login in App", this.state);
  };
  logout = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <Router>
        <Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect exact from="/" to="/events" />}
                {this.state.token && (
                  <Redirect exact from="/auth" to="/events" />
                )}
                {!this.state.token && <Redirect exact from="/" to="/auth" />}

                <Route path="/auth" component={Auth} />
                <Route path="/events" component={Events} />
                {this.state.token && (
                  <Route path="/bookings" component={Bookings} />
                )}
              </Switch>
            </main>
          </AuthContext.Provider>
        </Fragment>
      </Router>
    );
  }
}

export default App;
