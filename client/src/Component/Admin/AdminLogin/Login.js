import React from 'react';
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

const Login = (props) => {
    const classes = useStyles();
    const [formData, setFormData] = React.useState({
        mail: "",
        password: ""
    })
    const [formError, setFormError] = React.useState({
        mail: "",
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
                case 'mail':
                    if (formData[i] === "") {
                        setFormError({ ...formError, [i]: "This field is required." })
                        formError[i] = "This field is required.";
                        isValid = false;
                    }
                    break;
                case 'password':
                    if (formData[i] === "") {
                        setFormError({ ...formError, [i]: "This field is required." })
                        isValid = false;
                    }
                    break;
            }
        })
        return isValid;
    }

    const handleSubmit = async event => {
        event.preventDefault();
        if (isValidForm()){
            axios.post("http://localhost:4000/api/auth/admin/login",{
                email:formData.mail.toLowerCase().trim(),
                password:formData.password.trim(),
                role:2
            })
            .then(response => {
                if (response.status === 200) {
                    window.localStorage.setItem("token",response.data.token)
                    window.localStorage.setItem("name",response.data.name)
                    props.history.push(`/admin/dashboard`);
                }
            })
            .catch(error => {
                setServerErrorMessage("The EmailId or Password is not correct")
            })
        }
    }

    return (
        <div>
            <form className={classes.root} onSubmit={handleSubmit} >
                <Typography variant="h5">Admin Login</Typography>
                <TextField
                    type="text"
                    variant="outlined"
                    label="Admin Mail"
                    margin="normal"
                    value={formData.mail}
                    error={!!formError.mail}
                    helperText={formError.mail}
                    onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
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
                >Login</Button>
            </form>
        </div>
    )
}

export default Login;

