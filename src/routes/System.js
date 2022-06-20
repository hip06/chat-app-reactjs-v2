import React from "react";
import { Switch, Route } from 'react-router-dom'
import Profile from '../container/Profile/Profile'


class System extends React.Component {

    render() {
        return (
            <div className="System-container">
                <Switch>
                    <Route path='/system/profile' component={(Profile)} />

                </Switch>
            </div>
        )
    }
}

export default (System)