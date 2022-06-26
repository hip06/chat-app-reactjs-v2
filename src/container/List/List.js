import React from "react";
import './List.scss'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars-2'
import * as actions from '../../store/actions'
import { decrypt } from '../../ulties/crypt'


class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listFriend: null
        }
    }
    componentDidMount() {
        let userId = +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId)
        this.setState({
            listFriend: this.props?.dataAllFriend?.filter(item => item.status === 'OK')
        })
        this.props.socket.off('addFriendSucceedServer').on('addFriendSucceedServer', async () => {
            await this.props.fetchAllDataFriends({ userId })
        })

    }
    componentDidUpdate(prevProps) {
        if (prevProps.dataAllFriend !== this.props.dataAllFriend) {

            this.setState({
                listFriend: this.props.dataAllFriend?.filter(item => item.status === 'OK')
            })
        }
    }
    render() {
        // console.log(this.props);
        let { listFriend } = this.state
        // console.log(this.props.dataAllFriend);
        return (
            <div className="List-container">
                <Scrollbars style={{ width: '100%', height: '100%' }}>
                    {listFriend?.length > 0 && listFriend.map((item, index) => {
                        return (
                            <div onClick={() => this.props.handleCreateRoomChat(item)} className="item" key={index}>
                                <div className="wrap-img">
                                    <img src={item['receiver.avatar']} alt="avatar" />
                                </div>
                                <div className="username">
                                    {item['receiver.username']}
                                    <div className="status">
                                        <i className={item.status === 'Pending' ? "fas pending fa-circle" : item.status === 'OK' ? "fas ok fa-circle" : "fas fa-circle"}></i>
                                        {item.status === 'OK' ? 'Bạn bè' : item.status}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Scrollbars>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return ({
        dataAllFriend: state.user.allFriend,
        socket: state.app.socket,
        currentUser: state.auth.user,

    })
}
const dispatchStateToProps = (dispatch) => {
    return ({
        fetchAllDataFriends: (data) => dispatch(actions.getAllfriend(data)),
    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(List))