/*
 * @Author: Liu Yuchen
 * @Date: 2021-04-30 06:48:18
 * @LastEditors: Liu Yuchen
 * @LastEditTime: 2021-05-01 23:52:25
 * @Description: 
 * @FilePath: /reserve_master/src/App.js
 * @GitHub: https://github.com/liuyuchen777
 */

import Footer from './components/Footer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import About from './About'
import Header from './components/Header'
import Day from './components/Day'
import Equipments from './components/Equipments'
import React from 'react'
import Submit from './components/Submit'
import Login from './Login'
import LoginFail from './LoginFail'
import Logout from './components/Logout'
import Week from './components/Week'
import Placeholder from './components/Placeholder'
import {getThisWeek, getNextWeek, getNextNextWeek} from  './utils/weekFun'
import { Link } from 'react-router-dom'

/*
 * Equipment Status:
 * -1: no user selecte (white)
 * positive number (not user): other user selected) (gray with name under time)
 * user: this user selected (blue) 
 */

class Eqp {
  constructor(name) {
    this.name = name
    this.Appoint = new Array(3)
    for (let i = 0; i < this.Appoint.length; i++) {
      this.Appoint[i] = new Array(7)
      for (let j=0; j < this.Appoint[i].length; j++) {
        this.Appoint[i][j] = new Array(8).fill(-1)
      }
    }
    // some test change
    this.Appoint[0][2][2] = 8
  }

  getName() {
    return this.name
  }

  getState(week, day, time) {
    return this.Appoint[week][day][time]
  }

  changeAppoint(week, day, time, people) {
    this.Appoint[week][day][time] = people
    console.log(this.Appoint)
  }
}

class User {
  constructor(name, id, password) {
    this.name = name
    this.id = id
    this.password = password
  }

  getPasswd() {
    return this.password
  }

  getName() {
    return this.name
  }

  getID() {
    return this.id
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFlod: new Array(7).fill(false),
      user: -1,
      login_info: "Hello, Stranger!",
      week_status: 0
    }
    this.date = [
      getThisWeek(),
      getNextWeek(),
      getNextNextWeek()
    ]
    this.week = ['月', '火', '水', '木', '金', '土', '日']
    this.equipment_list = [new Eqp("Atomic Emission Spectronmeter"), new Eqp("Gas Chromatograph"), new Eqp("Size Exclusion Chromatograph")]
    // current user id
    // all user
    this.allUser = [new User("liuyuchen", 7, "123456"), new User("zhujunyi", 8, "123456")]
  }

  render() {
    const numbers = [0, 1, 2, 3, 4, 5, 6]
    const listItems = numbers.map((number) => 
      <div>
        <Day onFlod={() => {
          let temp = this.state.showFlod
          temp[number] = !temp[number]
          this.setState({showFlod: temp})
        }} day={this.date[this.state.week_status][number]} yobi={this.week[number]}/>

        {this.state.showFlod[number] ? <Equipments login_info={this.state.login_info} el={this.equipment_list} 
        day={number} user={this.state.user} allUser={this.allUser} week={this.state.week_status}/> : ''}
      </div>      
    )

    const nullComponent = (
      <div>
      </div>
    )
    
    const needLogin = (
      <div>
        <center>
          <h2>You Need Login</h2>
          <Link to="/">Go Back</Link>
        </center>
      </div>
    )

    return (
      <Router>
        <div className="container">
          <Header user={this.state.user} allUser={this.allUser} />
          <Route path='/' exact render={() => (
            <div>
              <Login changeUser={(data) => this.setState({user: data})} allUser={this.allUser} changeInfo={(data) => this.setState({login_info: data})} />
            </div>
          )} />
          <Route path='/main' exact render={() => (
            <div>
              <div>
                {this.state.user === -1 ? nullComponent :
                <center>
                  <Week text="<" onClick={() => {this.setState({week_status: (this.state.week_status===0 ? this.state.week_status : this.state.week_status-1)})}} />
                  <Placeholder text={this.state.week_status===0 ? "This Week" : this.state.week_status===1 ? "Next Week" : "Next Next Week"} />
                  <Week text=">" onClick={() => {this.setState({week_status: (this.state.week_status===2 ? this.state.week_status : this.state.week_status+1)})}}/>
                </center>
                }
              </div>
              <ul>{this.state.user===-1 ? needLogin : listItems}</ul>
              <div>
                {this.state.user === -1 ? nullComponent :
                <center>
                <Submit />
                <Logout allFlod={() => this.setState({showFlod: new Array(7).fill(false)})} changeUser={(data) => this.setState({user: data})} changeInfo={(data) => this.setState({login_info: data})}/>
                </center>
                }
              </div>
            </div>
            // submit buttom
          )} />
          <Route path='/fail' exact render={() => (
            <div>
              <LoginFail login_info={this.state.login_info}/>
            </div>
          )} />
          <Route path='/about' exact render={() => (
            <div>
              <About backState={this.state.user} />
            </div>
          )} />
          <Footer />
        </div>
      </Router>
  );
  }
}

export default App;
