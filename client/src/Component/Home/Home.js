import React from 'react';
import "./Home.css";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            meals: [],
            required:false,
            internet:false
        };
    }

    componentDidMount() {
        document.body.style.backgroundImage = "none";
        axios.get('http://localhost:4000/api/meals')
          .then((response) => {
            this.setState({ meals: response.data })
          })
          .catch(err => {
              this.setState({internet:true})
          })
      }

    mealDetails = (meal) => {
        if(window.localStorage.getItem("token") && window.localStorage.getItem("token").length > 10){
            this.props.history.push(`/mealDetails/${meal}`)
        }else{
            this.setState({required:true})
        }
    }

    render(){
        if(this.state.required){
            return(
                <React.Fragment>
                    <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Hey there</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>You need to SignUp to see the dishes and ingredients.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=>{this.setState({required:false})}} variant="secondary">Close</Button>
                        <Button onClick={()=>{this.props.history.push('/signUp/customer')}} variant="primary">Register</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </React.Fragment>
            )
        }
        let items=[]
        this.state.meals ? this.state.meals.forEach((meal, index) => {
            items.push(<div key={index} className="col col-md-6 col-lg-6">
                <div className={"thumbnail"}>
                    <img src={meal.photo} style={{"width":"85%","height":"50%"}} alt="products" className={"img img-rounded img-responsive"} />
                    <div className={"caption"} style={{ "textAlign": "center" }}>
                    <Link to="#" onClick={()=>{this.mealDetails(meal.name)}} ><h5 style={{"fontFamily":"cursive"}}>{meal.name}</h5></Link>
                    <h4><span style={{ "color": "red","fontFamily":"'Tangerine', cursive" }}>Rs. </span><span style={{ "color": "red" }}>{meal.price}</span></h4>
                    <p className={"description"}><span style={{"fontFamily":"'Tangerine', cursive","fontSize": "x-large" }}>Cusine : </span>{meal.cusine}</p>
                    {meal.type === "veg" ? <p className={"description"} style={{ "color": "darkgreen","fontFamily":"'Lobster', cursive" }}>{meal.type}</p> :  <p className={"description"} style={{ "color": "red","fontFamily":"'Lobster', cursive" }}>{meal.type}</p>}
                    <p className={"description"}><span style={{"fontFamily":"'Tangerine', cursive","fontSize": "x-large" }}>Time to prepare : </span>{meal.time} min</p>
                    <Link to="#" onClick={()=>{this.mealDetails(meal.name)}}><h5 style={{"font":"small-caps bold 16px/30px Georgia, serif" }}>see dishes and ingredients</h5></Link>
                    </div>
                </div>
            </div>);              
        }):items.push(null)
        return(
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        {items.length > 0 ? items : null}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Home;