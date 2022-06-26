import React from "react";
import './Conversation.scss'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import Message from "../Message/Message";
import { decrypt } from '../../ulties/crypt'
import { sendMessage, createNoticeOffline } from '../../services/userServices'
import { Scrollbars } from 'react-custom-scrollbars-2';

class Conversation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentText: '',
            messages: null,
            pastMessages: null,
            firstTime: true,
        }
        this.sender = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        this.messagesEndRef = React.createRef()
        this.prevConversationId = NaN
        this.prevMessage = null

    }
    async componentDidMount() {
        let { socket } = this.props
        // socket api
        socket.off('newChat').on('newChat', (dataNotice) => {
            if (dataNotice !== this.prevDataOnline) {
                this.props.noticeNewChat('Đối phương đang offline')
            }
            this.prevDataOnline = dataNotice
        })
        socket.off('receiveMessage').on('receiveMessage', (payloadMessage) => {
            if (JSON.stringify(this.prevMessage) !== JSON.stringify(payloadMessage.content)) {
                this.setState({
                    pastMessages: [... this.state.pastMessages, payloadMessage?.content],
                })
            }
            this.prevMessage = payloadMessage?.content
            this.scrollBottom()
        })
        socket.off('receiverOffilne').on('receiverOffilne', async (dataNotice) => {
            if (dataNotice !== this.prevDataOffline) {
                let response = await createNoticeOffline({
                    ...dataNotice?.content,
                    nameSender: dataNotice?.username,
                })
            }
            this.prevDataOffline = dataNotice
        })

    }
    async componentDidUpdate(prevProps) {
        let sender = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        let { socket, dataCreateRoom } = this.props
        if (prevProps.dataCreateRoom !== dataCreateRoom) {
            this.setState({
                pastMessages: dataCreateRoom.text ? JSON.parse(dataCreateRoom.text) : null
            })
            //socket api
            socket.emit('joinRoom', {
                conversationId: dataCreateRoom.conversationId,
                sender: sender,
                receiver: dataCreateRoom.to === sender ? dataCreateRoom.from : dataCreateRoom.to,
                prevConversationId: this.prevConversationId
            })
            this.prevConversationId = dataCreateRoom.conversationId
            this.scrollBottom()
        }
    }
    handleOnchangeTexte = (event) => {
        this.setState({
            currentText: event.target.value
        })
    }
    handleSendMessage = async (event) => {
        let sender = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        if (event.code === 'Enter') {
            let { currentText, pastMessages } = this.state
            let { socket, dataCreateRoom } = this.props
            let payloadMessage = {
                conversationId: dataCreateRoom.conversationId,
                username: this.props?.currentUser?.username,
                content: {
                    sender: sender,
                    receiver: dataCreateRoom.to === sender ? dataCreateRoom.from : dataCreateRoom.to,
                    text: currentText,
                    createAt: (new Date()).getTime()
                }
            }
            socket.emit('sendMessage', payloadMessage) // send socket server
            let response = await sendMessage(payloadMessage) // save database
            if (response?.data.err === 0) {
                this.setState({
                    currentText: '',
                    pastMessages: [...pastMessages, payloadMessage.content]
                })
                this.scrollBottom()
            }
        }
    }
    scrollBottom = () => {
        setTimeout(() => {
            this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'nearest' })
        }, 10)
    }
    render() {
        // console.log(this.props);
        let { dataCreateRoom } = this.props
        let { currentText, pastMessages } = this.state
        // console.log(pastMessages);
        return (
            <div className="Conversation-container">
                {dataCreateRoom ? <>
                    <div className="header-name">
                        {dataCreateRoom['User.username']}
                    </div>
                    <div className="box-chat">
                        <div className="messages">
                            <Scrollbars className="scroll-libra" style={{ width: '100%', height: '100%' }}  >
                                {pastMessages?.length > 0 && pastMessages.map((item, index) => {
                                    return (
                                        <Message
                                            key={index}
                                            avatar={dataCreateRoom['User.avatar']}
                                            own={item.sender === this.sender}
                                            content={item.text}
                                            time={item.createAt}
                                        />
                                    )
                                })}
                                <div ref={this.messagesEndRef}  ></div>
                            </Scrollbars>
                        </div>
                        <div className="input-message">
                            <textarea
                                value={currentText}
                                className="foem-control text"
                                onChange={(event) => this.handleOnchangeTexte(event)}
                                onKeyUp={(event) => this.handleSendMessage(event)}
                                placeholder="Text here..."></textarea>
                            <div className="icon">
                                <i className="fas fa-grin"></i>
                            </div>
                        </div>
                    </div>
                </> : <div className="no-room">Tạo cuộc trò chuyện mới bằng cách click vào bạn bè mà bạn muốn chat</div>}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return ({
        socket: state.app.socket,
        currentUser: state.auth.user,
    })
}
const dispatchStateToProps = (dispatch) => {
    return ({

    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Conversation))