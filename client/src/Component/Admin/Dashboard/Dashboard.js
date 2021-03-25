import React from "react";
import { withRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addMeal } from "../../../action";


class AdminDashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            meals:[],
            auth:false,
            update:false,
            add:false,
            delete:false,
            confirm:false,
            mealitem:""
        }
    }

    componentDidMount(){
        if(window.localStorage.getItem("token") && window.localStorage.getItem("token").length > 10){
            axios.post('http://localhost:4000/api/auth/admin/mealDetails',{},{headers:{Authorization : `Bearer ${localStorage.getItem('token')}`}})
                .then((response) => {
                    this.setState({ meals: response.data })
                })
                .catch(err => {
                    this.setState({auth:true})
                })
        }else{
            this.setState({auth:true})
        }
    }

    deleteMeal=()=>{
        axios.post('http://localhost:4000/api/auth/admin/deletemeal',{mealItem:this.state.mealitem},{headers:{Authorization : `Bearer ${localStorage.getItem('token')}`}})
                .then(response => {
                    this.props.history.push(`/`)
                    this.setState({ meals:response.data, delete:false, confirm:false, mealitem:"" })
                })
                .catch(err => {
                this.setState({auth:true, delete:false, confirm:false, mealitem:""})
            })
    }

    updateMeal=(meal)=>{
        this.props.addMealItem(meal);
        this.props.history.push(`/admin/updatemeal`)
    }

    render(){
        if(this.state.auth){
            return(
                <React.Fragment>
                    <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Hey there</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>You should have Administrator Access to View this page.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=>{window.localStorage.clear();this.props.history.push('/')}} variant="secondary">Home Page</Button>
                        <Button onClick={()=>{window.localStorage.clear();this.props.history.push('/login/admin')}} variant="primary">Admin Login</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </React.Fragment>
            )
        }
        if(this.state.confirm){
            return(
                <React.Fragment>
                    <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Hi {localStorage.getItem('name')}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you comfirmed to delete the Meal Item.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=>{this.setState({confirm:false})}} variant="secondary">Cancel</Button>
                        <Button onClick={()=>{this.deleteMeal()}} variant="primary">Delete</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </React.Fragment>
            )
        }
        let items=[]
        this.state.meals ? this.state.meals.forEach((meal, index) => {
            items.push(<div key={index} className="col col-md-6 col-lg-6">
                <div className={"thumbnail"}>
                    <br/>
                    <Button onClick={()=>{this.updateMeal(meal)}} variant="warning">Update Meal</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button onClick={()=>{this.setState({confirm:true,mealitem:meal.name})}} variant="danger">Delete Meal</Button><br/><br/>
                    <img src={meal.photo} style={{"width":"80%","height":"50%"}} alt="products" className={"img img-rounded img-responsive"} />
                    <div className={"caption"} style={{ "textAlign": "center" }}>
                        <Link to="#"><h5 style={{"fontFamily":"cursive"}}>{meal.name}</h5></Link>
                        <h4><span style={{ "color": "red","fontFamily":"'Tangerine', cursive" }}>Rs. </span><span style={{ "color": "red" }}>{meal.price}</span></h4>
                        <p className={"description"}><span style={{"fontFamily":"'Tangerine', cursive","fontSize": "x-large" }}>Cusine : </span>{meal.cusine}</p>
                        {meal.type === "veg" ? <p className={"description"} style={{ "color": "darkgreen","fontFamily":"'Lobster', cursive" }}>{meal.type}</p> :  <p className={"description"} style={{ "color": "red","fontFamily":"'Lobster', cursive" }}>{meal.type}</p>}
                        <p className={"description"}><span style={{"fontFamily":"'Tangerine', cursive","fontSize": "x-large" }}>Time to prepare : </span>{meal.time} min</p>
                    </div>
                </div>
            </div>);              
        }):items.push(null)
        return(
            <React.Fragment>
                <div className="container">
                    <br/>
                    <Button onClick={()=>{this.props.history.push(`/admin/addmeal`)}} variant="success">Add Meal</Button>
                    <div className="row">
                        {items.length > 0 ? items : null}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
  
const mapDispatchToProps = (dispatch) => {
    return {
      addMealItem: (mealItem) => dispatch(addMeal(mealItem))
    }
  };

export default withRouter(connect(null,mapDispatchToProps)(AdminDashboard));