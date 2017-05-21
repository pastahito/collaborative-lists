import React, {Component} from 'react'
import { connect } from 'react-redux'
import LandingPage from './landing_page/LandingPage.jsx'
import Main from './main/Main.jsx'

const App = (props) => {
    if (props.credential.username){
        return <Main/>
    } else {
        return <LandingPage/>
    }
}

const mapStateToProps = state => {
    return {
        credential: state.credential
    }
}

export default connect(mapStateToProps)(App)
