import React from "react";
import './Login.scss'
import { withRouter } from "react-router-dom";
import { register, login } from '../../services/authService'
import { updateAvatar } from '../../services/userServices'
import { ToastContainer, toast } from 'react-toastify';
import { connect } from "react-redux";
import * as actions from '../../store/actions'
import ModalSelectAvatar from "../ModalSelectAvatar/ModalSelectAvatar";




class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: true,
            username: '',
            password: '',
            password2: '',
            isModal: false,
            userId: null,
            avatar: null,
            usernameAPI: null
        }
    }
    handleOnChange = (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }
    handleSubmit = async () => {
        let { username, password, password2 } = this.state
        if (username === '' && password === '') {
            toast.warn('missing input')
            return
        }
        if (this.state.isLogin) {
            let response = await login({
                username,
                password
            })
            if (response && response.data.err === 0) {
                this.setState({
                    isModal: true,
                    userId: response.data.user.userId,
                    avatar: response.data.user.avatar || 'https://img.freepik.com/free-vector/cute-cat-gaming-cartoon_138676-2969.jpg?w=2000',
                    usernameAPI: response.data.user.username
                })
            } else if (response && response.data.err !== 0) {
                toast.error(response.data.msg)
            }
        } else {
            if (password !== password2) {
                toast.warn('password and password again must be same')
            } else {
                let response = await register({
                    username,
                    password
                })
                if (response && response.data.err === 0) {
                    toast.success(response.data.msg)
                    this.setState({
                        password: '',
                        password2: '',
                        username: '',
                        isLogin: true
                    })
                } else {
                    toast.error(response.data.msg)
                }
            }

        }
    }
    handleEnter = (event) => {
        if (event.code === 'Enter') this.handleSubmit()
    }
    handleUpdateAvatar = async (selectedAvatar, event) => {
        let { usernameAPI, userId } = this.state
        let avatar = selectedAvatar ? selectedAvatar : this.state.avatar
        let response = await updateAvatar({ avatar, userId })
        if (response && response.data.err === 0) {
            this.props.loginSuccess({ username: usernameAPI, userId, avatar })
            this.setState({
                password: '',
                password2: '',
                username: ''
            })
        } else {
            toast.error(response.data.msg)
            this.setState({
                isModal: false
            })
        }
    }
    render() {
        return (
            <>
                <div className="Login-container">
                    <div className="box-login">
                        <h1>{this.state.isLogin ? 'Login' : 'Sign Up'}</h1>
                        <div className="item">
                            <input
                                type="text"
                                className="form-control"
                                onChange={(event) => this.handleOnChange(event, 'username')}
                                value={this.state.username}
                                placeholder='Username'
                                onKeyUp={(event) => this.handleEnter(event)}

                            />
                        </div>
                        <div className="item">
                            <input
                                type="password"
                                className="form-control"
                                onChange={(event) => this.handleOnChange(event, 'password')}
                                value={this.state.password}
                                placeholder='Password'
                                onKeyUp={(event) => this.handleEnter(event)}
                            />
                        </div>
                        {!this.state.isLogin && <>
                            <div className="item">
                                <input
                                    type="password"
                                    onChange={(event) => this.handleOnChange(event, 'password2')}
                                    value={this.state.password2}
                                    className="form-control"
                                    placeholder="Password again"
                                    onKeyUp={(event) => this.handleEnter(event)}

                                />
                            </div>
                            <button onClick={() => this.handleSubmit()} className="btn btn-primary">Submit</button>
                            <span onClick={() => this.setState({ isLogin: true })}>Go login !</span>
                        </>}
                        {this.state.isLogin && <>
                            <button onClick={() => this.handleSubmit()} className="btn btn-primary">Submit</button>
                            <span onClick={() => this.setState({ isLogin: false })}>Chưa có tài khoản?</span>
                        </>}
                    </div>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
                {this.state.isModal && <ModalSelectAvatar
                    handleUpdateAvatar={this.handleUpdateAvatar}
                    toggleModal={this.toggleModal}
                />}
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return ({
        userId: state.auth.user
    })
}
const dispatchStateToProps = (dispatch) => {
    return ({
        loginSuccess: (data) => dispatch(actions.loginSuccess(data))
    })
}

export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Login))