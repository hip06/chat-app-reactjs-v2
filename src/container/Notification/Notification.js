import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import './Notification.scss'
import { updateStatusFriend } from '../../services/userServices'


class Notification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    handleUpdateStatusFriend = async (item) => {
        let response = await updateStatusFriend(item.response)
        // them ban OK
        console.log(response);
    }
    render() {
        let { notificationContent } = this.props
        console.log(notificationContent);
        return (
            <div className="Notification-container">
                {notificationContent?.length === 0 ? (
                    <div className="item">Không có thông báo nào</div>
                ) : (
                    notificationContent.map((item, index) => {
                        return (
                            <div key={index} className="item">
                                <div className="content">{item.message}</div>
                                {item.btn && <div className="btns">
                                    <button onClick={() => this.handleUpdateStatusFriend(item)} type="button" className="btn btn-primary btn-notice">Đồng ý</button>
                                    <button type="button" className="btn btn-danger btn-notice">Từ chối</button>
                                </div>}
                            </div>
                        )
                    })
                )}
                <div className="clear-notification">
                    <p onClick={() => this.props.clearNotification()}>Xóa tất cả thông báo</p>
                </div>
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
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Notification))