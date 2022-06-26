import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import './Message.scss'


class Message extends React.Component {

    timestampToDate = (timestamp) => {
        let date = new Date(timestamp)
        return `${date.getHours()}:${date.getMinutes()}`
    }
    render() {
        let { own, avatar, content, time } = this.props
        return (
            <div className={own ? "Message-container own" : "Message-container"}>
                <img className={own ? "avatar disabled" : "avatar"} src={avatar} alt="avatar" />
                <div className={own ? "content-message second" : "content-message receiver"}>
                    {content}
                </div>
                <div className={own ? "create-at first" : "create-at"}>{this.timestampToDate(time)}</div>
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
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Message))