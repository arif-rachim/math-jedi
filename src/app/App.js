import React from "react";
import OpeningScreen from "./opening-screen/OpeningScreen";
import AppContextProvider from "./App.actions";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import RegistrationScreen from "./registration-screen/RegistrationScreen";
import {NotificationContextProvider} from "./common/Notification";
import SessionScreen from "./session-screen/SessionScreen";

export default function App() {
    return <Router >
        <AppContextProvider>
            <NotificationContextProvider>
                <Switch>
                    <Route path={"/register"}>
                        <RegistrationScreen/>
                    </Route>
                    <Route path={"/session/:sessionId"}>
                        <SessionScreen/>
                    </Route>
                    <Route path={"/"}>
                        <OpeningScreen/>
                    </Route>
                </Switch>
            </NotificationContextProvider>
        </AppContextProvider>
    </Router>
}
