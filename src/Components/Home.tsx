import { Typography } from '@material-ui/core';
import React from 'react';

interface IProps
{
    userID: any;
}
class Register extends React.Component<IProps,{}>
{
    constructor(props:any)
    {
        super(props);
    }
    public render()
    {
        return(
            <div id = "login-container">
            <Typography variant = "h2"> Welcome to Dear Diary </Typography>
            {
                this.props.userID !== null ? 
                <Typography variant = "h6" style = {{marginTop:20}}> 
                    Thanks for Logging in, you can enter a new
                    entry and view your diary by using the tabs
                    to the left.
                </Typography>:
                <Typography variant = "h6" style = {{marginTop:20}}>
                    Thanks for visiting, please login or register
                    to use the diary.
                </Typography>
            }
            </div>

        );
    }
    
}

export default Register;