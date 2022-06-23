import React from "react";
import { withRouter } from "react-router-dom";
import './header.scss'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { decrypt } from '../../ulties/crypt'
import { handleAddFriendService } from '../../services/userServices'
import { ToastContainer, toast } from 'react-toastify';


class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataUser: null,
            allDataFriend: null,
            keyword: '',
            suggestFriends: null,
            notificationMessageCounter: 0,
            notificationCounter: 0,
            notificationContent: []
        }
    }
    async componentDidMount() {
        let { socket } = this.props
        let userId = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        //socket event
        socket.emit('online', { userId })
        socket.on('addFriendOnline', (response) => {
            console.log(response)
        })
        socket.on('addFriendOffline', (response) => {
            console.log(response)
        })

        // fetch api
        await this.props.fetchAllDataUsers()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.dataAllUsers !== this.props.dataAllUsers) {
            this.setState({ allDataUser: this.props.dataAllUsers })
        }
        if (prevProps.dataAllFriend !== this.props.dataAllFriend) {
            this.setState({ allDataFriend: this.props.dataAllFriend })
        }
    }
    handleSearch = (event) => {
        let { allDataUser } = this.state
        this.setState({
            keyword: event.target.value
        }, () => {
            if (this.state.keyword.trim() !== '' && allDataUser.length > 0) {
                let suggestFriends = allDataUser.filter(item => item.username.includes(this.state.keyword) && item.id !== +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId))
                this.setState({ suggestFriends })
            } else {
                this.setState({
                    suggestFriends: []
                })
            }
        })
    }
    handleAddFriend = async (item) => {
        let { socket } = this.props
        let userId = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        let payload = {
            userId: this.props?.currentUser?.userId,
            friendId: item.id,
            username: item.username
        }
        let response = await handleAddFriendService(payload)
        if (response?.data?.err === 0) {
            // socket emit
            socket.emit('reqAddFriend', { ...payload, userId })
            // toast notice
            toast.success(`Đã gửi thành công đề nghị kết bạn tới ${item.username}`)

        }
    }
    render() {
        // console.log(this.props);
        let { keyword, suggestFriends, notificationCounter, notificationMessageCounter } = this.state
        // console.log(this.props.socket);
        return (
            <>
                <div className="Header-container">
                    <div className="logo">Chat App</div>
                    <div className="search">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="search friends..."
                            value={keyword}
                            onChange={(event) => this.handleSearch(event)}
                        />
                        <div className="suggest">
                            {suggestFriends && suggestFriends.length > 0 && suggestFriends.map((item, index) => {
                                return (
                                    <div key={index} className="item-suggest">
                                        <div className="wrap-info">
                                            <img src={item.avatar} alt="avatar" />
                                            <div className="username">{item.username}</div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => this.handleAddFriend(item)}
                                        >
                                            <i className="fas fa-plus"></i>Thêm bạn
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="avatar">
                        <div className="account">
                            <div className="message icon-notice">
                                <i className="fas fa-comments"></i>
                                <div className="notification-counter">{notificationMessageCounter}</div>
                            </div>
                            <div className="notice icon-notice">
                                <i className="fas fa-bell"></i>
                                <div className="notification-counter">{notificationCounter}</div>
                            </div>
                            <div className="avatar-img">avatar</div>
                        </div>
                        <button className="btn btn-danger" onClick={this.props.logout}>Log out</button>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return ({
        dataAllUsers: state.user.allDataUser,
        currentUser: state.auth.user,
        dataAllFriend: state.user.allFriend,
        socket: state.app.socket
    })
}
const dispatchStateToProps = (dispatch) => {
    return ({
        fetchAllDataUsers: () => dispatch(actions.getAllUsers()),
        fetchAllDataFriends: () => dispatch(actions.getAllfriend()),
        logout: () => dispatch(actions.logout())
    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Header))