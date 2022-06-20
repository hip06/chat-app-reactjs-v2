import React from "react";
import { withRouter } from "react-router-dom";
import './ModalSelectAvatar.scss'
import { connect } from 'react-redux'


class ModalSelectAvatar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedAvatar: null,
            avatar: null
        }
        this.avatarOptions = [
            'https://pickaface.net/gallery/avatar/unr_balddarcy_180316_2126_bkxt.png',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfkRUFbRCu8_U1DONl-p20GAKs9IgOrmqraQGftl7OviG8kyHrAoBkIy2FESZfobm-llU&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx6rvBU568j2IF3h7IlzfAoYpAwGBsxiVumDJ8i1c5oRkWsCb0x-a12mv6THIdGnZhckk&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6snQTswx3tTjtDGWT-HAJucFwTeknFsVmeVeeyFrrToYB2ukxc-8YNcdh_Xb8o5XfFJ8&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVifs4CS5Nha_6eu3lapu55pAgkuAPwpz-UJgdH5sCqzF7rSiPDpj2bXWwCvau-92TJwY&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Nj07lytDoTcTx5jbq9OpxE8njxdHeP4EtEY-RnfbZcBogYcNgJSjYuEBADNS1I7pfSY&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh7YWf_uuU4IN9zn0n6PgxpiCEovXGfugVzZoTG2Yuo47-vMBXyD858k7yRnHO5bDJ3_8&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmXimeAjB7frVK5N4QIuyPVC3S6hrxKVya-A&usqp=CAU'
        ]
    }
    componentWillUnmount() {
        this.setState({
            selectedAvatar: null,
            avatar: null
        })
    }
    handleSelectAvatar = (item, event, index) => {
        event.stopPropagation()
        this.setState({
            avatar: item,
            selectedAvatar: index
        })
    }
    render() {
        return (
            <div className="ModalSelectAvatar-container">
                <div className="box-modal">
                    <h3>Chọn ảnh đại diện</h3>
                    <div className="options-img">
                        {this.avatarOptions.map((item, index) => {
                            return (
                                <div key={index} onClick={(event) => this.handleSelectAvatar(item, event, index)} className={this.state.selectedAvatar === index ? "wrap-img selected" : "wrap-img"}>
                                    <img src={item} alt="avatar" />
                                </div>
                            )
                        })}
                    </div>
                    <div className="btn-submit">
                        <button onClick={() => this.props.handleUpdateAvatar(this.state.avatar)} className="btn btn-primary">Submit</button>
                        <button onClick={() => this.props.handleUpdateAvatar()} className="btn btn-danger">I already have a my avatar ! </button>
                    </div>
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
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(ModalSelectAvatar))