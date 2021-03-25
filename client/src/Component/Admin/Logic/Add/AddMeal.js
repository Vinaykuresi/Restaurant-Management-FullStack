import React from "react";
import { withRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddMeal.css';
import SessionTimeOut from "../../../Session/Session";
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class AddMeal extends React.Component{
    constructor(props){
        super(props);
        this.buildFormData = this.buildFormData.bind(this);
        this.state={
            meal:{
                    name:"",
                    price:0,
                    cusine:'',
                    photo:'',
                    type:'veg',
                    time:'',
                    dishes:[{
                        name:"",
                        type:"starter",
                        ingredients:[
                            {
                                name:"",
                                quantity:"",
                                units:""
                            }
                        ]
                    }]},
            auth:false,
            radioType:{
                veg:"veg",
                NonVeg:"Non-veg"
            },
            required:"",
            formError:false,
            success:false
        }
    }

    addDish = () => {
        let dish = this.state.meal.dishes[this.state.meal.dishes.length-1]
        let index = dish.ingredients.length-1
        if(dish.name , dish.ingredients[index].name , dish.ingredients[index].quantity , dish.ingredients[index].units){
            let meal = {}
            this.setState(prevState => {
                meal = Object.assign({},prevState.meal);
                meal.dishes.push({
                    name:"",
                    type:"starter",
                    ingredients:[
                        {
                            name:"",
                            quantity:"",
                            units:""
                        }
                    ]
                })
                return {meal}
            })
        }else{
            this.setState({required:"Dish"})
        }
        
    }

    addIngredients = () => {
        let ingredient = this.state.meal.dishes[this.state.meal.dishes.length-1].ingredients
        ingredient = ingredient[ingredient.length-1]
        if(ingredient.name && ingredient.quantity && ingredient.units){
            let meal = {}
            this.setState(prevState => {
                meal = Object.assign({},prevState.meal);
                meal.dishes[meal.dishes.length-1].ingredients.push({
                    name:"",
                    quantity:"",
                    units:""
                })
                return {meal}
            })
        }else{
            this.setState({required:"Ingredient"})
        }
    }

    addMeal = (meal) => {
        const value = meal.target.value;
        const field = meal.target.name;
        this.setState(prevState => {
            meal = Object.assign({},prevState.meal);
            meal[field] = value
            return {meal}
        })
      };

    addPhoto = (meal) => {
        const value = meal.target.files[0];
        const field = meal.target.name;
        this.setState(prevState => {
            meal = Object.assign({},prevState.meal);
            meal[field] = value
            return {meal}
        })
    }
    
    addMealDishes = (name, mealType) => {
        const value = mealType.target.value.toString();
        const field = mealType.target.name;
        let meal={}
        this.setState(prevState => {
            meal = Object.assign({},prevState.meal);
            meal.dishes.map(dish=>{
                if(dish.name === name) {dish[field]=value}
            })
            return {meal}
        })
    };

    addMealIngredients = (name, dish, ingredient)=>{
        const value = ingredient.target.value.toString();
        const field = ingredient.target.name;
        let meal = {}
        this.setState(prevState => {
            meal = Object.assign({},prevState.meal);
            meal.dishes.map(dishe=>{
                if(dishe.name === dish) {
                    dishe.ingredients.map(ingredient => {
                        if(ingredient.name === name){
                            ingredient[field]=value
                        }
                    })
                }
            })
            return {meal}
        })
    }

    buildFormData(formData, data, parentKey) {
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
          Object.keys(data).forEach(key => {
            this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
          });
        } else {
          const value = data == null ? '' : data;
      
          formData.append(parentKey, value);
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        let meals = Object.assign({},this.state.meal)
        await this.buildFormData(formData, meals);
        axios.post('http://localhost:4000/api/auth/admin/addmeal',formData,{headers:{Authorization : `Bearer ${localStorage.getItem('token')}`,'content-type': `multipart/form-data`}})
        .then(response => {
            this.setState({success:true})
        })
        .catch(error => {
            if(error.response && error.response.status == 403){
                window.localStorage.clear();
                this.setState({auth:true})
            }else{
                this.setState({formError:true})
            }
        })
    }

    render(){
        if(this.state.required){
            return(
                <React.Fragment>
                     <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Hey {localStorage.getItem("name")}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>You need fill all Current {this.state.required}, before adding Another {this.state.required} .</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={()=>{this.setState({required:""})}} variant="primary">Home Page</Button>
                        </Modal.Footer>
                    </Modal.Dialog>   
                </React.Fragment>
            )
        }
        if(this.state.success){
            return(
                <React.Fragment>
                     <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Hey {localStorage.getItem("name")}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>You have successfully inserted the Meal details in Database.</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={()=>{this.props.history.push('/')}} variant="primary">Go to Home Page</Button>
                            <Button onClick={()=>{this.setState({success:false})}} variant="primary">Add another Meal</Button>
                        </Modal.Footer>
                    </Modal.Dialog>   
                </React.Fragment>
            )
        }
        if(this.state.formError){
            return(
                <React.Fragment>
                     <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Hey {localStorage.getItem("name")}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Your form submitted is not Valid, please submit a valid Meal details.</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={()=>{this.setState({formError:false})}} variant="primary">Home Page</Button>
                        </Modal.Footer>
                    </Modal.Dialog>   
                </React.Fragment>
            )
        }
        if(this.state.auth){
            return(
                <React.Fragment>
                     <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Hey {localStorage.getItem("name")}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>You should have Administrator Access to Submit this form. Please Login with Administrator Credentials</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={()=>{window.localStorage.clear();this.props.history.push('/')}} variant="secondary">Home Page</Button>
                            <Button onClick={()=>{window.localStorage.clear();this.props.history.push('/login/admin')}} variant="primary">Admin Login</Button>
                        </Modal.Footer>
                    </Modal.Dialog>   
                </React.Fragment>
            )
        }
        return(
            <React.Fragment>
                {window.localStorage.getItem('token') && window.localStorage.getItem('token').length>10 && Object.keys(this.state.meal).length>0 ?
                    <div className="container">
                        <form onSubmit={this.handleSubmit}  encType='multipart/form-data'>
                            <div className="row">
                                <div className="thumbnail">
                                    <h4 style={{backgroundColor:"gray",borderRadius:"5px",padding:"1% 0%"}}>Update Meal</h4>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="mealName">Meal Name</label>
                                            <input type="text" className="form-control" id="mealName" name="name" value={this.state.meal.name} onChange={this.addMeal} placeholder="Meal Name" required />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="price">Price</label>
                                            <input className="form-control" id="price" type="number" name="price" value={this.state.meal.price} onChange={this.addMeal} placeholder="Price" required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col" style={{ marginTop: "3.7%" }}>

                                            <div className="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="customRadioInline1" value={this.state.radioType.veg} onChange={this.addMeal} checked={this.state.meal.type===this.state.radioType.veg} name="type" className="custom-control-input" required/>
                                                <label className="custom-control-label"  htmlFor="customRadioInline1">{this.state.radioType.veg}</label>
                                            </div>
                                            <div className="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="customRadioInline2" value={this.state.radioType.NonVeg} onChange={this.addMeal} checked={this.state.meal.type===this.state.radioType.NonVeg} name="type" className="custom-control-input" />
                                                <label className="custom-control-label" htmlFor="customRadioInline2">{this.state.radioType.NonVeg}</label>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="time">Time (in minutes)</label>
                                            <input type="number" className="form-control" id="time" name="time" value={this.state.meal.time} onChange={this.addMeal} placeholder="Time" required/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label htmlFor="cusine" style={{ marginLeft: '5%' }}>Cusine</label>
                                        <input type="text" style={{ margin: '0% 5%' }} className="form-control" id="cusine" name="cusine" value={this.state.meal.cusine} onChange={this.addMeal} placeholder="Cusine Name" required/>
                                    </div>
                                    <br/>
                                    <div className="row">
                                        <label htmlFor="photoImage" style={{ marginLeft: '5%' }}>Upload Meal Photo</label>
                                        <input type="file" style={{ margin: '0% 5%' }} accept=".png, .jpg, .jpeg" className="form-control-file" id="photoImage" name="photo" onChange={this.addPhoto} required/>
                                    </div>
                                    <br/>
                                    <h5 style={{backgroundColor:"rgb(197 196 195)",borderRadius:"5px",padding:"1% 0%", marginTop:"1%"}}>Dishes</h5>
                                    <div>
                                        {this.state.meal.dishes.map((dish,index) => {
                                            return (
                                                <div key={index}>
                                                    <br/>
                                                    <h5 style={{backgroundColor:"#e7e7e7",borderRadius:"5px",padding:"1% 0%", marginTop:"1%"}}>{index+1} Dish</h5>
                                                    <div className="row">
                                                        <div className="col">
                                                            <label htmlFor="dishName">Dish Name</label>
                                                            <input type="text" className="form-control" id="dishName" name="name" value={dish.name} onChange={(e)=>this.addMealDishes(dish.name,e)} placeholder="Dish Name" required/>
                                                        </div>
                                                        <div className="col">
                                                            <label htmlFor="inputState">Dish Type</label>
                                                            <select id="inputState" name="type" value={dish.type} onChange={(e)=>this.addMealDishes(dish.name,e)} className="form-control" required>
                                                                <option value="starter">Starter</option>
                                                                <option value="main">main</option>
                                                                <option value="dessert">dessert</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <h6>Ingredients</h6>
                                                    {dish.ingredients.map((ingredient,index) => {
                                                        return (
                                                            <div key={index} className="row">
                                                                <div className="col">
                                                                    <label htmlFor="ingredientName">ingredient Name</label>
                                                                    <input type="text" className="form-control" id="ingredientName" name="name" value={ingredient.name} onChange={(e)=>this.addMealIngredients(ingredient.name,dish.name,e)} placeholder="Ingredient Name" required/>
                                                                </div>
                                                                <div className="col">
                                                                    <label htmlFor="quantity">Quantity</label>
                                                                    <input type="number" className="form-control" id="quantity" name="quantity" value={ingredient.quantity} onChange={(e)=>this.addMealIngredients(ingredient.name,dish.name,e)} placeholder="Ingredient Quantity" required/>
                                                                </div>
                                                                <div className="col">
                                                                    <label htmlFor="units">Units</label>
                                                                    <input type="text" className="form-control" id="units" name="units" value={ingredient.units} onChange={(e)=>this.addMealIngredients(ingredient.name,dish.name,e)} placeholder="Ingredient Units" required/>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                    )
                                                })}
                                            </div>
                                        <Button style={{marginTop:"1%"}} onClick={this.addDish} variant="primary">Add Dish</Button>
                                        &nbsp;&nbsp;&nbsp;
                                        <Button style={{marginTop:"1%"}} onClick={this.addIngredients} variant="primary">Add Ingredient</Button>
                                        <br/>
                                    
                                </div>
                            </div>
                            <Button type="submit" style={{marginTop:"1%"}} variant="success">Add Meal to Database</Button>
                            <br/>
                        </form>
                    </div>
                    :
                    <React.Fragment>
                        <Modal.Dialog>
                            <Modal.Header closeButton>
                                <Modal.Title>Hey there</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <p>You need to login as an Administrator to View ans Bubmit thie Meal Form.</p>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button onClick={()=>{this.props.history.push('/')}} variant="secondary">Home Page</Button>
                                <Button onClick={()=>{this.props.history.push('/login/admin')}} variant="primary">Admin Login</Button>
                            </Modal.Footer>
                        </Modal.Dialog>   
                    </React.Fragment>}
            </React.Fragment>
        )
    }
}

export default withRouter(AddMeal);