import React from "react";
import { withRouter } from "react-router-dom";
import './header.scss'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { decrypt } from '../../ulties/crypt'
import { handleAddFriendService } from '../../services/userServices'
import { ToastContainer, toast } from 'react-toastify';
import Notification from "../Notification/Notification";


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
            notificationContent: [],
            notificationMessageContent: [],
            isShowNotification: false,
            isClickSuggest: false,
            friendSendRequest: []
        }
        this.responseOnline = null
        this.responseOffline = null
    }
    async componentDidMount() {
        let { socket } = this.props
        let userId = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        //socket event
        socket.emit('online', { userId })
        // role là người đc nhận lời mời kết bạn (receiver)
        socket.off('addFriendOnline').on('addFriendOnline', (response) => {
            if (JSON.stringify(this.responseOnline) !== JSON.stringify(response)) {
                this.setState({
                    notificationCounter: this.state.notificationCounter += 1,
                    notificationContent: [...this.state.notificationContent, {
                        type: 'addFriend',
                        message: `Bạn có một đề nghị kết bạn từ ${response.usernameSender}`,
                        response,
                        btn: true
                    }]
                })
            }
            this.responseOnline = response
        })
        // role là người gửi lời mời kết bạn (sender)
        socket.off('addFriendOffline').on('addFriendOffline', (response) => {
            if (JSON.stringify(this.responseOffline) !== JSON.stringify(response)) {
                this.setState({
                    notificationCounter: this.state.notificationCounter += 1,
                    notificationContent: [...this.state.notificationContent, {
                        type: 'addFriend',
                        message: `Tài khoản ${response.usernameReceiver} đang offline, lời mời đang ở chế độ chờ`,
                        response,
                        btn: false
                    }]
                })
            }
            this.responseOffline = response
        })

        // fetch api
        await Promise.all([this.props.fetchAllDataUsers(), this.props.fetchAllDataFriends({ userId })])
    }
    componentDidUpdate(prevProps) {
        if (prevProps.dataAllUsers !== this.props.dataAllUsers) {
            this.setState({ allDataUser: this.props.dataAllUsers })
        }
        if (prevProps.dataAllFriend !== this.props.dataAllFriend) {
            console.log('here');
            this.setState({ allDataFriend: this.props.dataAllFriend })
        }
    }
    handleSearch = (event) => {
        let { allDataUser, allDataFriend } = this.state
        this.setState({
            keyword: event.target.value
        }, () => {
            if (this.state.keyword.trim() !== '' && allDataUser.length > 0) {
                let suggestFriends = allDataUser
                    .filter(item => item.username.includes(this.state.keyword) && item.id !== +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId))
                    .filter(item2 => !allDataFriend.some(item3 => item3.to === item2.id))
                this.setState({ suggestFriends })
            } else {
                this.setState({
                    suggestFriends: []
                })
            }
        })
    }
    clearNotification = () => {
        this.setState({
            notificationContent: []
        })
    }
    handleAddFriend = async (item) => {
        let { socket } = this.props
        let userId = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        let payload = {
            userId: this.props?.currentUser?.userId,
            friendId: item.id,
            usernameReceiver: item.username,
            usernameSender: this.props?.currentUser?.username
        }
        let response = await handleAddFriendService(payload)
        if (response?.data?.err === 0) {
            await this.props.fetchAllDataFriends({ userId })
            // socket emit
            socket.emit('reqAddFriend', { ...payload, userId })
            // toast notice
            this.setState({
                friendSendRequest: [...this.state.friendSendRequest, item.id]
            })
            toast.success(`Đã gửi thành công đề nghị kết bạn tới ${item.username}`)

        }
    }
    toggleNotification = (type) => {
        this.setState({
            isShowNotification: this.state.isShowNotification === type ? false : type,
            notificationCounter: type === 2 ? 0 : this.state.notificationCounter,
            notificationMessageCounter: type === 1 ? 0 : this.state.notificationMessageCounter,
        })
    }
    handleOnBlurSearch = () => {
        if (!this.state.isClickSuggest) {
            this.setState({
                keyword: '',
                suggestFriends: []
            })
        }
    }
    handleHideSuggest = () => {
        this.setState({ isClickSuggest: false }, () => {
            this.handleOnBlurSearch()
        })
    }
    render() {
        // console.log(this.props.dataAllFriend);
        let { keyword, suggestFriends, notificationCounter, notificationMessageCounter, isShowNotification, notificationContent, notificationMessageContent,
            friendSendRequest } = this.state
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
                        <div
                            onMouseEnter={() => this.setState({ isClickSuggest: true })}
                            onMouseLeave={() => this.handleHideSuggest()}
                            className="suggest"
                        >
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
                                            {friendSendRequest?.some(item2 => item2 === item.id) ? 'Đã gửi kết bạn' : <><i className="fas fa-plus"></i>Thêm bạn</>}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="avatar">
                        <div className="account">
                            <div className="message icon-notice">
                                <i onClick={() => this.toggleNotification(1)} className="fas fa-comments"></i>
                                {notificationMessageCounter !== 0 && <div className="notification-counter">{notificationMessageCounter}</div>}
                                {isShowNotification === 1 && <Notification
                                    notificationContent={notificationMessageContent}
                                    clearNotification={this.clearNotification}
                                />}
                            </div>
                            <div className="notice icon-notice">
                                <i onClick={() => this.toggleNotification(2)} className="fas fa-bell"></i>
                                {notificationCounter !== 0 && <div className="notification-counter">{notificationCounter}</div>}
                                {isShowNotification === 2 && <Notification
                                    notificationContent={notificationContent}
                                    clearNotification={this.clearNotification}
                                />}
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
        fetchAllDataFriends: (data) => dispatch(actions.getAllfriend(data)),
        logout: () => dispatch(actions.logout())
    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Header))