import React from "react";
import './Conversation.scss'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import Message from "../Message/Message";
import { decrypt } from '../../ulties/crypt'
import { sendMessage, getPastChat } from '../../services/userServices'
import { Scrollbars } from 'react-custom-scrollbars-2';

class Conversation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentText: '',
            messages: null,
            pastMessages: null,
            firstTime: true
        }
        this.sender = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        this.messagesEndRef = React.createRef()

    }
    async componentDidMount() {
        let { socket } = this.props
        //fetch api

        // socket api
        socket.off('newChat').on('newChat', (data) => {
            console.log(data)
        })
        socket.on('receiveMessage', (mes) => {
            console.log(mes)
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
                receiver: dataCreateRoom.to === sender ? dataCreateRoom.from : dataCreateRoom.to
            })
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
            let { currentText } = this.state
            let { socket, dataCreateRoom } = this.props
            socket.emit('sendMessage', currentText)
            let response = await sendMessage({
                conversationId: dataCreateRoom.conversationId,
                content: {
                    sender: sender,
                    receiver: dataCreateRoom.to === sender ? dataCreateRoom.from : dataCreateRoom.to,
                    text: currentText,
                    createAt: (new Date()).getTime()
                }
            })
            if (response?.data.err === 0) {
                this.setState({
                    currentText: ''
                })
            }
        }
    }
    scrollBottom = () => {
        setTimeout(() => {
            this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
                </> : <div className="no-room">Tạo cuộc trò chuyện mới bằng cách click vào người bạn muốn nhắn</div>}
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