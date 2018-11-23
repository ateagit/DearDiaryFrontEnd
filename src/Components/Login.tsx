import { Button, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { isNullOrUndefined } from 'util';


interface IProps
{
    idChange:any,
    history:any
}

class Login extends React.Component<IProps,{}>
{
    constructor(props:any)
    {
        super(props)
        this.checkUserInfo = this.checkUserInfo.bind(this);
    }
    public render()
    {
        return(
            <div id = "login-container">
            <Typography variant = "h2"> Login</Typography>
                <form >
                    <div className = "input-container">
                        <TextField id = "username" label="Username" fullWidth = {true} margin="normal"/>
                    </div>
                    <div className = "input-container">
                        <TextField id = "password" label="Password" fullWidth = {true} margin="normal"/>
                    </div>
                    <div className = "input-container">
                        
                        <Button onClick = {this.checkUserInfo} className = "login-but" color = "primary" variant = "contained">Login</Button>
                        
                        <Link className = "anchor" to='/Register'>
                            <Button style = {{display:"block", marginRight:0, marginLeft : "auto", marginTop: 20}}>Register here</Button>
                        </Link>
                    </div>
                    
                </form>
            </div>

        );
    }

    private checkUserInfo()
    {
        const userInput = document.getElementById("username") as HTMLInputElement;
        const passInput = document.getElementById("password") as HTMLInputElement;
        
        const userVal = userInput.value;
        const passVal = passInput.value;

        if(userVal == null || userVal === "" || passVal == null || passVal === "")
        {
            alert("Please enter the required name and password fields");
            return;
        }

        const formData = new FormData();
        
        formData.append("Username", userVal);
        formData.append("Password", passVal);

        const url = "https://deardiaryapimsa.azurewebsites.net/api/Diary/CheckUser";

        fetch(url, 
            {
                body: formData,
                headers: 
                {
                    Accept: 'application/json',
                    'cache-control': 'no-cache', 
                },
                method: 'POST'
            }).then((response) =>
            {
                if(!response.ok)
                {
                    alert(response.statusText);
                }
                return response;
            }).then(response => response.json())
            .then(data =>
            {
                
                const x = data;
                if(!isNullOrUndefined(data) && data.length !== 0)
                {
                    this.props.idChange(x);
                    
                    this.props.history.push('/')
                    
                }
                else
                {
                    alert("Invalid Username or Password");
                    
                }
            });
    }
}

export default Login;