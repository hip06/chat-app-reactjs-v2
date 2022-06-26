import React from "react";
import './Conversation.scss'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import Message from "../Message/Message";
import { decrypt } from '../../ulties/crypt'
import { sendMessage, createNoticeOffline } from '../../services/userServices'
import { Scrollbars } from 'react-custom-scrollbars-2';
import Picker from 'emoji-picker-react'
import { toast } from 'react-toastify'
import toBase64 from '../../ulties/toBase64'

class Conversation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentText: '',
            messages: null,
            pastMessages: [],
            firstTime: true,
            isShowEmoji: false,
            file: null,
            isSendImage: false
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
                await createNoticeOffline({
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
            console.log(dataCreateRoom);
            this.setState({
                pastMessages: dataCreateRoom.text ? JSON.parse(dataCreateRoom.text) : []
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
        if (event.code === 'Enter' || event.type === 'click') {
            let { currentText, pastMessages, isSendImage, file } = this.state
            let { socket, dataCreateRoom } = this.props
            let payloadMessage = {
                conversationId: dataCreateRoom.conversationId,
                username: this.props?.currentUser?.username,
                content: {
                    sender: sender,
                    receiver: dataCreateRoom.to === sender ? dataCreateRoom.from : dataCreateRoom.to,
                    text: isSendImage ? file : currentText,
                    createAt: (new Date()).getTime()
                }
            }

            socket.emit('sendMessage', payloadMessage) // send socket server
            let response = await sendMessage(payloadMessage) // save database
            if (response?.data.err === 0) {
                this.setState({
                    currentText: '',
                    pastMessages: [...pastMessages, payloadMessage.content],
                    isSendImage: false,
                    file: ''
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
    onEmojiClick = (event, emojiObject) => {
        event.stopPropagation()
        this.setState({
            currentText: this.state.currentText + emojiObject.emoji
        })
    }
    handleChangeFile = async (event) => {
        if (event.target.files?.length === 1) {
            this.setState({
                file: await toBase64(event.target.files[0]),
                isSendImage: true,
                currentText: ' '
            })
        } else {
            toast.info('Mỗi lần chỉ gửi được 1 ảnh thôi')
        }
    }
    // set prev img

    render() {
        let { dataCreateRoom } = this.props
        let { currentText, pastMessages, isShowEmoji, isSendImage, file } = this.state
        return (
            <div className="Conversation-container">
                {dataCreateRoom ? <>
                    <div className="header-name">
                        {`Room chat with ${dataCreateRoom['receiver.username']}`}
                    </div>
                    <div className="box-chat">
                        <div className="messages">
                            <Scrollbars className="scroll-libra" style={{ width: '100%', height: '100%' }}  >
                                {pastMessages?.length > 0 && pastMessages.map((item, index) => {
                                    return (
                                        <Message
                                            key={index}
                                            avatar={dataCreateRoom['receiver.avatar']}
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
                                placeholder="Text here somethings...then hit ENTER"
                            ></textarea>
                            {isSendImage && <div className="prev-img"><img src={file} alt="" /></div>}
                            <div className="icon">
                                <div className="emoji-btn btn btn-primary" onClick={(event) => this.handleSendMessage(event)}><i className="fas fa-paper-plane"></i>Gửi</div>
                                <div className="emoji-btn btn btn-danger" onClick={() => this.setState({ isShowEmoji: !this.state.isShowEmoji })} >
                                    <i className="fas fa-grin"></i>
                                    Emoji
                                </div>
                                <label htmlFor="insert-img" className="emoji-btn btn btn-success"><i className="fas fa-file-upload"></i>Chèn ảnh</label>
                                <input type="file" onChange={(event) => this.handleChangeFile(event)} hidden id="insert-img" />
                                {isShowEmoji && <div className="box-emoji">
                                    <Picker
                                        disableSearchBar={true}
                                        disableSkinTonePicker={true}
                                        pickerStyle={{ boxShadow: 'none', backgroundColor: 'rgb(32,32,32)', scrollbarWidth: 'none' }}
                                        groupVisibility={{ flags: false }}
                                        onEmojiClick={this.onEmojiClick}
                                    />
                                </div>}
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