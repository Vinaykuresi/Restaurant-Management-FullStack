import React from 'react';
import { withRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table'

class CustomerDashborad extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mealDetails:{},
            auth:false
        }
    }

    componentDidMount(){
        if(window.localStorage.getItem("token") && window.localStorage.getItem("token").length > 10){
            axios.post('http://localhost:4000/api/meals/mealDetails',{mealName:this.props.match.params.meal},{headers:{Authorization : `Bearer ${localStorage.getItem('token')}`}})
                .then((response) => {
                    this.setState({ mealDetails: response.data })
                })
                .catch(err => {
                    this.setState({auth:true})
                })
        }else{
            this.setState({auth:true})
        }
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
                        <p>You are not authenticated to Visit this page. Please Login again.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=>{window.localStorage.clear();this.props.history.push('/')}} variant="secondary">Close</Button>
                        <Button onClick={()=>{window.localStorage.clear();this.props.history.push('/login/customer')}} variant="primary">Login</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </React.Fragment>
            )
        }
        var productItems = []
        if(!this.state.auth && Object.keys(this.state.mealDetails).length){
            productItems = this.state.mealDetails.dishes.map((item) => {
                const id = item.name;
                  return (
                    <tr key={id}>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Units</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.ingredients.map(ingredient => {
                                        return(
                                            <tr key={ingredient.name}>
                                                <td>{ingredient.name}</td>
                                                <td>{ingredient.quantity}</td>
                                                <td>{ingredient.units}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                      </td>
                    </tr>
                  );
              });
        }

        return(
            <React.Fragment>
                <React.Fragment>
                <div className={"container-fluid"}>
                    <div className={"row"} style={{ "maxWidth": "100%" }}>
                        <div className={"col-sm-5"}>
                            <div className={"thumbnail"}>
                                <img src={this.state.mealDetails.photo} style={{"width":"65%","height":"50%"}} alt="products" className={"img img-rounded img-responsive"} />
                                <div className={"caption"} style={{ "textAlign": "center" }}>
                                <Link to="#"><h5 style={{"fontFamily":"cursive"}}>{this.state.mealDetails.name}</h5></Link>
                                <h4><span style={{ "color": "red","fontFamily":"'Tangerine', cursive" }}>Rs. </span><span style={{ "color": "red" }}>{this.state.mealDetails.price}</span></h4>
                                <p className={"description"}><span style={{"fontFamily":"'Tangerine', cursive","fontSize": "x-large" }}>Cusine : </span>{this.state.mealDetails.cusine}</p>
                                {this.state.mealDetails.type === "veg" ? <p className={"description"} style={{ "color": "darkgreen","fontFamily":"'Lobster', cursive" }}>{this.state.mealDetails.type}</p> :  <p className={"description"} style={{ "color": "red","fontFamily":"'Lobster', cursive" }}>{this.state.mealDetails.type}</p>}
                                <p className={"description"}><span style={{"fontFamily":"'Tangerine', cursive","fontSize": "x-large" }}>Time to prepare : </span>{this.state.mealDetails.time} min</p>
                                </div>
                            </div>
                        </div>
                        <div className={"col-sm-7"}>
                            <Form>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                        <th>Dish</th>
                                        <th>Type</th>
                                        <th>Ingredients</th>
                                        </tr>
                                    </thead>
                                    <tbody>{productItems}</tbody>
                                </Table>
                            </Form>
                        </div>
                    </div>
                </div>
                </React.Fragment>
            </React.Fragment>
        )
    }
}

export default withRouter(CustomerDashborad);

