import React from "react";
import { withRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UpdateMeal.css';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';


class UpdateMeal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meal: this.props.mealItem,
            auth: false,
            radioType:{
                veg:"veg",
                NonVeg:"Non-veg"
            }
        }
    }

    updateMeal = (meal) => {
        const value = meal.target.value;
        const field = meal.target.name;
        this.setState(prevState => {
            meal = Object.assign({},prevState.meal);
            meal[field] = value
            return {meal}
        })
      };

      updatePhoto = (meal) => {
        const value = meal.target.files[0];
        const field = meal.target.name;
        this.setState(prevState => {
            meal = Object.assign({},prevState.meal);
            meal[field] = value
            return {meal}
        })
    }
    
    updateMealDishes = (name, mealType) => {
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

    updateMealIngredients = (name, dish, ingredient)=>{
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

    buildFormData = (formData, data, parentKey) => {
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
          Object.keys(data).forEach(key => {
            this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
          });
        } else {
          const value = data == null ? '' : data;
      
          formData.append(parentKey, value);
        }
    }

    handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        let meals = Object.assign({},this.state.meal)
        await this.buildFormData(formData, meals);

        axios.post('http://localhost:4000/api/auth/admin/updatemeal',meals,{headers:{Authorization : `Bearer ${localStorage.getItem('token')}`}})
                .then(response => {
                    this.setState({success:true})
                    this.props.history.push('/')
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

    render() {
        return (
            <React.Fragment>
                {window.localStorage.getItem('token') && window.localStorage.getItem('token').length>10 && Object.keys(this.state.meal).length>0 ?
                
                <div className="container">
                    <div className="row">
                        <div className="thumbnail">
                            <h4 style={{backgroundColor:"gray",borderRadius:"5px",padding:"1% 0%"}}>Update Meal</h4>
                            <form onSubmit={this.handleSubmit}  encType='multipart/form-data'>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor="mealName">Meal Name</label>
                                        <input type="text" className="form-control" id="mealName" name="name" value={this.state.meal.name} onChange={this.updateMeal} placeholder="Meal Name" disabled/>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="price">Price</label>
                                        <input type="number" className="form-control" id="price" name="price" value={this.state.meal.price} onChange={this.updateMeal} placeholder="Price" required/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col" style={{ marginTop: "3.7%" }}>

                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline1" value={this.state.radioType.veg} onChange={this.updateMeal} checked={this.state.meal.type===this.state.radioType.veg} name="type" className="custom-control-input" required/>
                                            <label className="custom-control-label"  htmlFor="customRadioInline1">{this.state.radioType.veg}</label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline2" value={this.state.radioType.NonVeg} onChange={this.updateMeal} checked={this.state.meal.type===this.state.radioType.NonVeg} name="type" className="custom-control-input" />
                                            <label className="custom-control-label" htmlFor="customRadioInline2">{this.state.radioType.NonVeg}</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="time">Time (in minutes)</label>
                                        <input type="number" className="form-control" id="time" name="time" value={this.state.meal.time} onChange={this.updateMeal} placeholder="Time" required/>
                                    </div>
                                </div>
                                <div className="row">
                                    <label htmlFor="cusine" style={{ marginLeft: '5%' }}>Cusine</label>
                                    <input type="text" style={{ margin: '0% 5%' }} className="form-control" id="cusine" name="cusine" value={this.state.meal.cusine} onChange={this.updateMeal} placeholder="Cusine Name" required/>
                                </div>
                                <br/>
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
                                                        <input type="text" className="form-control" id="dishName" name="name" value={dish.name} onChange={(e)=>this.updateMealDishes(dish.name,e)} placeholder="Dish Name" required/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="inputState">Dish Type</label>
                                                        <select id="inputState" name="type" value={dish.type} onChange={(e)=>this.updateMealDishes(dish.name,e)} className="form-control" required>
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
                                                                <input type="text" className="form-control" id="ingredientName" name="name" value={ingredient.name} onChange={(e)=>this.updateMealIngredients(ingredient.name,dish.name,e)} placeholder="Ingredient Name" required/>
                                                            </div>
                                                            <div className="col">
                                                                <label htmlFor="quantity">Quantity</label>
                                                                <input type="number" className="form-control" id="quantity" name="quantity" value={ingredient.quantity} onChange={(e)=>this.updateMealIngredients(ingredient.name,dish.name,e)} placeholder="Ingredient Quantity" required/>
                                                            </div>
                                                            <div className="col">
                                                                <label htmlFor="units">Units</label>
                                                                <input type="text" className="form-control" id="units" name="units" value={ingredient.units} onChange={(e)=>this.updateMealIngredients(ingredient.name,dish.name,e)} placeholder="Ingredient Units" required/>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                                <Button type="submit" style={{marginTop:"1%"}} variant="warning">Update</Button>
                            </form>
                        </div>
                    </div>
                </div>
                :
                <React.Fragment>
                     <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Hey there</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>There is no data available here to update.</p>
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

const mapStateToProps = (state) => {
    return {
        mealItem: state.mealItem.mealItem,
    };
};

export default withRouter(connect(mapStateToProps)(UpdateMeal));