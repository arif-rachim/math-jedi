import React from "react";
import OpeningScreen from "./opening-screen/OpeningScreen";
import AppContextProvider from "./App.actions";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Registration from "./registration/Registration";
import {NotificationContextProvider} from "./common/Notification";

export default function App() {
    return <Router>
        <AppContextProvider>
            <NotificationContextProvider>
                <Switch>
                    <Route path={"/register"}>
                        <Registration/>
                    </Route>
                    <Route path={"/"}>
                        <OpeningScreen/>
                    </Route>
                </Switch>
            </NotificationContextProvider>
        </AppContextProvider>
    </Router>
}
