import React from "react";
import './App.scss'
import { Router, Switch, Route } from 'react-router-dom'
import history from './components/history'
import Login from "./container/Login/Login";
import Home from "./routes/Home";
import System from "./routes/System";
import { protector, redirecter } from './hoc/authentication'
import { Redirect } from 'react-router-dom'
import { io } from 'socket.io-client'
import { connect } from "react-redux";

let socket = io(process.env.REACT_APP_URL_NODEJS)


class App extends React.Component {
  componentDidMount() {
    this.props.startSocket(socket)
  }
  render() {
    return (
      <Router history={history}>
        <div className="App-container">
          <Switch>
            <Route exact path='/' component={(Home)} />
            <Route path='/login' component={redirecter(Login)} />
            <Route path='/system' component={protector(System)} />
            <Route component={() => <Redirect to={'/login'} />} />

          </Switch>
        </div>
      </Router>
    )
  }
}
const dispatchStateToProps = (dispatch) => {
  return ({
    startSocket: (socket) => dispatch({ type: 'START_SOCKET', data: socket })
  })
}

export default connect(null, dispatchStateToProps)(App)