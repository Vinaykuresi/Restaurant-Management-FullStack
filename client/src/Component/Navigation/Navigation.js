import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';
import axios from 'axios';
import { connect } from 'react-redux';

class Navigation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            count: 0,
        };
    }
    onLogout = (event) => {
        event.preventDefault()
        axios.get(`http://localhost:4000/api/auth/logout`,{headers:{Authorization : `Bearer ${localStorage.getItem('token')}`}})
        .then(response => {
        if(response.status === 200){
            window.localStorage.clear();
            window.location.href = "/";
          }
        })
        .catch(err => {
            window.alert("You are not Successfully logged in, please log in Again");
            window.localStorage.clear();
            window.location.href = "/";
        })
      }
    adminRegister = (event) => {
        event.preventDefault()
        this.props.history.push('/signUp/admin');
    }
    customerRegister = (event) => {
        event.preventDefault()
        this.props.history.push('/signUp/customer');
    }
    render(){
        return(
            <React.Fragment>
                <Navbar bg="dark" style={{ "height": "75px" }}>
                    <Navbar.Brand href="/" style={{"marginBottom":'10px'}}>
                        <img height="40px" alt="csp1" src={process.env.PUBLIC_URL + '/images/home.png'} />
                    </Navbar.Brand>
                    <h2 id="name-header">Restaurant Mangement</h2>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            {window.localStorage.getItem('token') ?
                            <React.Fragment>
                                <NavItem>
                                    <h6 className="name">Hello, {window.localStorage.getItem('name')}</h6>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                    <button className="logout" onClick={(event)=>this.onLogout(event)}>Logout</button>
                                </NavItem>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <NavItem>
                                    <button className="logout" onClick={(event)=>this.customerRegister(event)}>Cutomer SignUp</button>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <   button className="logout" onClick={(event)=>this.adminRegister(event)}>Admin SignUp</button>
                                </NavItem>
                        </React.Fragment>}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </React.Fragment>
        )
    }
}

export default withRouter(Navigation);