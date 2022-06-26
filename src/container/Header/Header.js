import React from "react";
import { withRouter } from "react-router-dom";
import './header.scss'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { decrypt } from '../../ulties/crypt'
import { handleAddFriendService, getNoticeOffline, deleteNoticeOffline } from '../../services/userServices'
import { toast } from 'react-toastify';
import Notification from "../Notification/Notification";


class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataUser: null,
            allDataFriend: null,
            keyword: '',
            suggestFriends: null,
            notificationCounter: 0,
            notificationContent: [],
            notificationMessageCounter: 0,
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
                    notificationContent: [{
                        type: 'addFriend',
                        message: `Bạn có một đề nghị kết bạn từ ${response.usernameSender}`,
                        response,
                        btn: true
                    },
                    ...this.state.notificationContent
                    ]
                })
            }
            this.responseOnline = response
        })
        // role là người gửi lời mời kết bạn (sender)
        socket.off('addFriendOffline').on('addFriendOffline', (response) => {
            if (JSON.stringify(this.responseOffline) !== JSON.stringify(response)) {
                this.setState({
                    notificationCounter: this.state.notificationCounter += 1,
                    notificationContent: [{
                        type: 'addFriend',
                        message: `Tài khoản ${response.usernameReceiver} đang offline, lời mời đang ở chế độ chờ`,
                        response,
                        btn: false
                    },
                    ...this.state.notificationContent
                    ]
                })
            }
            this.responseOffline = response
        })

        // fetch api
        let [response, ...rest] = await Promise.all([getNoticeOffline(userId), this.props.fetchAllDataUsers(), this.props.fetchAllDataFriends({ userId })])
        if (response?.data.err === 0) {
            let sender = 0
            let dataNotice = response?.data?.response.filter(item => {
                if (item.from === sender) {
                    return false
                } else {
                    sender = item.from
                    return true
                }
            })
            this.setState({
                notificationMessageCounter: this.state.notificationMessageCounter += dataNotice.length,
                notificationMessageContent: [
                    ...this.state.notificationMessageContent,
                    ...this.formatNotice(dataNotice)

                ]
            })
        }
    }
    formatNotice = (data) => {
        let formatedData = []
        if (data && data.length > 0) {
            formatedData = data.map(item => {
                return {
                    btn: false,
                    message: `Bạn có tin nhắn mới từ ${item.nameSender} khoảng ${this.formatTimeSeconds(new Date() - new Date(+item.timestamp))} trước`
                }
            })
        }
        return formatedData
    }
    formatTimeSeconds = (seconds) => {
        let minutes = NaN
        let hours = NaN
        while (seconds >= 60) {
            minutes = Math.floor(seconds / 60)
            seconds = seconds % 60
        }
        while (minutes >= 60) {
            hours = Math.floor(seconds / 60)
            minutes = seconds % 60
        }
        return hours === 0 ? `${minutes} phút ${seconds} giây` : minutes === 0 && hours === 0 ? `${seconds} giây` : `${hours} giờ ${minutes} phút ${seconds} giây`
    }
    componentDidUpdate(prevProps) {
        if (prevProps.dataAllUsers !== this.props.dataAllUsers) {
            this.setState({ allDataUser: this.props.dataAllUsers })
        }
        if (prevProps.dataAllFriend !== this.props.dataAllFriend) {
            let newAddFriend = this.props.dataAllFriend.filter(item => item.status === 'Pending')
            this.setState({
                allDataFriend: this.props.dataAllFriend,
                notificationCounter: newAddFriend.length > 0 ? this.state.notificationCounter + newAddFriend.length : this.state.notificationCounter,
                notificationContent: newAddFriend.length > 0 ? [...newAddFriend.map(item => {
                    return {
                        message: `Bạn có lời mời kết bạn từ ${item['sender.username']}`,
                        btn: true,
                        response: {
                            userId: item.from,
                            friendId: item.to
                        }
                    }
                }), ...this.state.notificationContent] : this.state.notificationContent
            })
        }
        if (prevProps.noticeMessage !== this.props.noticeMessage) {
            this.setState({
                notificationMessageCounter: this.state.notificationMessageCounter += 1,
                notificationMessageContent: [
                    this.props.noticeMessage,
                    ...this.state.notificationMessageContent
                ]
            })
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
        let { isShowNotification, notificationContent, notificationMessageContent } = this.state
        this.setState({
            notificationContent: isShowNotification === 2 ? [] : notificationContent,
            notificationMessageContent: isShowNotification === 1 ? [] : notificationMessageContent
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
    toggleNotification = async (type) => {
        // delete notice offline before
        if (type === 1 && this.state.isShowNotification) {
            await deleteNoticeOffline(+decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId))
        }
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
                            <div className="avatar-img">
                                <img src={this.props?.currentUser?.avatar} alt="" />
                                <div className="name">{this.props?.currentUser?.username}</div>
                            </div>
                        </div>
                        <button title="Đăng xuất" className="btn btn-danger" onClick={this.props.logout}><i className="fas fa-sign-out-alt"></i></button>
                    </div>
                </div>
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