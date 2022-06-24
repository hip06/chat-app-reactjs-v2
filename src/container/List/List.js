import React from "react";
import './List.scss'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import * as userServices from '../../services/userServices'
import * as actions from '../../store/actions'
import { toast } from 'react-toastify';


class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listFriend: null
        }
    }
    async componentDidMount() {
        this.setState({
            listFriend: this.props.dataAllFriend
        })

    }
    async componentDidUpdate(prevProps) {
        if (prevProps.dataAllFriend !== this.props.dataAllFriend) {
            this.setState({
                listFriend: this.props.dataAllFriend
            })
        }
    }

    handleCreateRoomChat = (item) => {
        if (item.status === 'OK') {
            // tạo room chat
        } else {
            toast.warn(`Bạn và ${item['User.username']} vẫn chưa kết bạn !`)
        }
    }
    render() {
        // console.log(this.props);
        let { listFriend } = this.state
        return (
            <div className="List-container">
                {listFriend?.length > 0 && listFriend.map((item, index) => {
                    return (
                        <div onClick={() => this.handleCreateRoomChat(item)} className="item" key={index}>
                            <div className="wrap-img">
                                <img src={item['User.avatar']} alt="avatar" />
                            </div>
                            <div className="username">
                                {item['User.username']}
                                <div className="status">
                                    <i className={item.status === 'Pending' ? "fas pending fa-circle" : item.status === 'OK' ? "fas ok fa-circle" : "fas fa-circle"}></i>
                                    {item.status}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return ({
        dataAllFriend: state.user.allFriend,
        socket: state.app.socket

    })
}
const dispatchStateToProps = (dispatch) => {
    return ({

    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(List))