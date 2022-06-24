import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import './Message.scss'


class Message extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        let { own } = this.props
        return (
            <div className={own ? "Message-container own" : "Message-container"}>
                <div className={own ? "content-message second" : "content-message"}>
                    Message-container Message-container Message-container Message-container Message-containerMessage-containerMessage-containerMessage-container
                </div>
                <div className={own ? "create-at first" : "create-at"}>17:00</div>
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