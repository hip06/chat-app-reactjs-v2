import React from "react";
import './List.scss'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import * as userServices from '../../services/userServices'
import * as actions from '../../store/actions'


class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            infofriends: null
        }
    }
    async componentDidMount() {


    }
    async componentDidUpdate(prevProps) {

    }


    render() {

        return (
            <div className="List-container">
                list
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
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(List))