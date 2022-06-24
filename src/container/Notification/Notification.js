import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import './Notification.scss'
import { updateStatusFriend } from '../../services/userServices'
import { ToastContainer, toast } from 'react-toastify';
import * as actions from '../../store/actions'
import { decrypt } from '../../ulties/crypt'


class Notification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isCheckedNotification: []
        }
    }
    handleUpdateStatusFriend = async (item, index) => {
        let userId = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        let response = await updateStatusFriend(item.response)
        if (response?.data.err === 0) {
            await this.props.fetchAllDataFriends({ userId })
            toast.info('Kết bạn thành công !')
            this.setState({ isCheckedNotification: [...this.state.isCheckedNotification, index] })
        }
    }
    render() {
        let { notificationContent } = this.props
        let { isCheckedNotification } = this.state
        return (
            <>
                <div className="Notification-container">
                    {notificationContent?.length === 0 ? (
                        <div className="item">Không có thông báo nào</div>
                    ) : (
                        notificationContent.map((item, index) => {
                            return (
                                <div key={index} className={isCheckedNotification.some(item => item === index) ? "item isChecked" : 'item'}>
                                    <div className="content">{item.message}</div>
                                    {item.btn && <div className="btns">
                                        <button onClick={() => this.handleUpdateStatusFriend(item, index)} type="button" className="btn btn-primary btn-notice">Đồng ý</button>
                                        <button type="button" className="btn btn-danger btn-notice">Từ chối</button>
                                    </div>}
                                </div>
                            )
                        })
                    )}
                    <div className="clear-notification">
                        <p onClick={() => {
                            this.props.clearNotification()
                            this.setState({ isCheckedNotification: [] })
                        }}>Xóa tất cả thông báo</p>
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
        currentUser: state.auth.user,
    })
}
const dispatchStateToProps = (dispatch) => {
    return ({
        fetchAllDataFriends: (data) => dispatch(actions.getAllfriend(data)),
    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Notification))