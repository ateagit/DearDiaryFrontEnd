import { Button, TextField, Typography } from '@material-ui/core';
import React from 'react';


class Register extends React.Component<{}>
{
    public render()
    {
        return(
            <div id = "login-container">
            <Typography variant = "h2"> Register </Typography>
                <form >
                    <div className = "input-container">
                        <TextField id = "Rusername" label="Username" fullWidth = {true} margin="normal"/>
                    </div>
                    <div className = "input-container">
                        <TextField id = "Rpassword" label="Password" fullWidth = {true} margin="normal"/>
                    </div>
                    <div className = "input-container">
                        <Button onClick = {this.UploadUser} className = "Rlogin-but" color = "secondary" variant = "contained">Register</Button>
                    </div>
                    
                </form>
            </div>

        );
    }
    private UploadUser()
    {
        const userInput = document.getElementById("Rusername") as HTMLInputElement;
        const passInput = document.getElementById("Rpassword") as HTMLInputElement;
        
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

        const url = "https://deardiaryapimsa.azurewebsites.net/api/Diary/CreateUser";

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
                else
                {
                    window.location.replace("/");
                }
            });
    }
}

export default Register;