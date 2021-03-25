import React from 'react';
import "./Register.css"
import { TextField, makeStyles, Button, Typography } from '@material-ui/core';
import axios from "axios";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: 600,
        padding: theme.spacing(4),
        margin: '0 auto',
        marginTop: theme.spacing(4)
    },
    button: {
        marginTop: theme.spacing(2)
    },
    serverErrorMessage: {
        marginTop: theme.spacing(2),
        fontWeight: 500,
        textAlign: 'center',
    }
}));

const Register = (props) => {
    const classes = useStyles();
    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        password: ""
    })
    const [formError, setFormError] = React.useState({
        username: "",
        email: "",
        password: ""
    })
    const [serverErrorMessage, setServerErrorMessage] = React.useState("")

    React.useEffect(() => {
        document.body.style.background = "none";
        document.body.style.backgroundSize = "none";
    })

    const isValidForm = () => {
        let isValid = true;
        Object.keys(formData).forEach(i => {
            switch (i) {
                case 'username':
                    if (formData[i] === "") {
                        setFormError({ ...formError, [i]: "This field is required." })
                        formError[i] = "This field is required.";
                        isValid = false;
                    }else{
                        formError[i] =""
                    }
                    break;
                case 'email':
                    if (formData[i] === "") {
                        setFormError({ ...formError, [i]: "This field is required." })
                        formError[i] = "This field is required.";
                        isValid = false;
                    }
                    else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formData[i])){
                        setFormError({ ...formError, [i]: "The Mail is not Valid" })
                        formError[i] = "The Mail is not Valid.";
                        isValid = false;
                    }else{
                        formError[i] = ""
                    }
                    break;
                case 'password':
                    if (formData[i] === "") {
                        setFormError({ ...formError, [i]: "This field is required." })
                        formError[i] = "This field is required."
                        isValid = false;
                    }
                    else if(!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData[i])){
                        setFormError({ ...formError, [i]: "The password should be combination of Capital, Lower and Numeric." })
                        formError[i] = "The password should be combination of Capital, Lower and Numeric."
                        isValid = false;
                    }else{
                        formError[i] = ""
                    }
                    break;
            }
        })
        return isValid;
    }

    const handleSubmit = async event => {
        event.preventDefault();
        if (isValidForm()){
            axios.post("http://localhost:4000/api/auth/customer/register",{
                username:formData.username.toLowerCase().trim(),
                password:formData.password.trim(),
                email:formData.email.toLowerCase().trim(),
                role:1
            })
            .then(response => {
                if (response.status === 200) {
                    props.history.push(`/login/customer`);
                }
            })
            .catch(error => {
                setServerErrorMessage("Email already exists, please try to Login with existing credentials")
            })
        }
    }

    const handleLogin = async event => {
        event.preventDefault();
        props.history.push(`/login/customer`);
    }

    return (
        <div>
            <form className={classes.root} onSubmit={handleSubmit} >
                <Typography variant="h5">Customer Login</Typography>
                <TextField
                    type="text"
                    variant="outlined"
                    label="Username"
                    margin="normal"
                    value={formData.username}
                    error={!!formError.username}
                    helperText={formError.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <TextField
                    type="text"
                    variant="outlined"
                    label="Mail"
                    margin="normal"
                    value={formData.email}
                    error={!!formError.email}
                    helperText={formError.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                    variant="outlined"
                    label="Password"
                    type="text"
                    margin="normal"
                    type="password"
                    value={formData.password}
                    error={!!formError.password}
                    helperText={formError.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <div>
                    {serverErrorMessage ? <Typography className={classes.serverErrorMessage} color="error">{serverErrorMessage}</Typography> : ""}
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                >Register</Button>
                <div className="row">
                    <div className="column">Already a Customer ? </div>
                    <div className="column"><Button
                        onClick={handleLogin}
                        variant="contained"
                        color="primary"
                        className={classes.button}
                    >Login</Button></div>
                </div>
            </form>
        </div>
    )
}

export default Register;