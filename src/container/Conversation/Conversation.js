import React from "react";
import './Conversation.scss'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import Message from "../Message/Message";


class Conversation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentText: '',
            messages: null
        }
    }
    handleOnchangeTexte = (event) => {
        this.setState({
            currentText: event.target.value
        })
    }
    render() {
        // console.log(this.props);
        let { dataCreateRoom } = this.props
        let { currentText } = this.state
        console.log(currentText);
        return (
            <div className="Conversation-container">
                {dataCreateRoom ? <>
                    <div className="header-name">
                        {dataCreateRoom['User.username']}
                    </div>
                    <div className="box-chat">
                        <div className="messages">
                            <Message currentText={currentText} own={true} />
                            <Message currentText={currentText} />
                        </div>
                        <div className="input-message">
                            <textarea
                                value={currentText}
                                className="foem-control text"
                                onChange={(event) => this.handleOnchangeTexte(event)}
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

    })
}
const dispatchStateToProps = (dispatch) => {
    return ({

    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Conversation))