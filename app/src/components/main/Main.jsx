import React, {Component} from 'react'
import { connect } from 'react-redux'
import TransitionGroup from 'react-transition-group/TransitionGroup'

import {logOut} from '../../websocketActions.js'
import styles from './styles.css'
import List from '../list/List.jsx'

class Main extends Component {
  render() {
    return <div className={styles.mainContainer}>
      <div className={styles.sideBar}>
        <div className={styles.title}>
          Collab Lists
        </div>
        <div className={styles.menu}>
          <div>
              <span className={styles.active}>
                  Lastests
              </span>
          </div>
          <div>
              <span className={styles.hoverable}>
                  Most Popular
              </span>
          </div>
          <div>
              <span className={styles.hoverable}>
                  Most Voted
              </span>
          </div>
          <div>
              <span className={styles.hoverable}>
                  Closed Lists
              </span>
          </div>
        </div>
        <div className={styles.logout} onClick={() => logOut()}>
            <span className={styles.logoutHover}>
                Log Out
            </span>
        </div>
      </div>

      <TransitionGroup component={'div'} className={styles.container}>
        {this.props.latests.map(list => <List key={list.id} list={list} />)}
      </TransitionGroup>

    </div>
  }
}

const mapStateToProps = state => {
    return {
      latests: state.changefeeds.latests
    }
}

export default connect(mapStateToProps)(Main)
