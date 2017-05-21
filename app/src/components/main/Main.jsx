import React, {Component} from 'react'
import { connect } from 'react-redux'
import {logOut} from '../../websocketActions.js'

class Main extends Component {
    render() {
        return <div>
            Hi, my name is Main.
            <div onClick={() => logOut()}>
                Log Out
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps)(Main)
