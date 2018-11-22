
import { Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemText, Toolbar} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import * as React from "react";
import { Link } from 'react-router-dom';
import mainLogo from './logo.svg';


interface IState
{
    mobileOpen: any
}
class SideNav extends React.Component<{}, IState>
{
    constructor(props:any)
    {
        super(props);
        this.state = 
        {
            mobileOpen:false
        }
        this.drawerToggle = this.drawerToggle.bind(this);
    }
    
    public render()
    {
       
        return(  
            <div>
            
                <Hidden smDown = {true}>
                <Drawer  variant="permanent" anchor="left" style = {{width:270}} PaperProps = {{style : {width:270}}}>
                
                        <List>
                            <ListItem>
                                <img src = {mainLogo} />
                            </ListItem>
                        </List>
                        <List component = "nav">
                            <Link className = "anchor" to='/' >
                                <ListItem button = {true}>
                                
                                    <ListItemText primary = "First Nav" className = "navText"/>
                                
                                </ListItem>
                            </Link>
                            <Divider/>
                            <Link className = "anchor" to='/Form'>
                                <ListItem button = {true}>
                                    
                                        <ListItemText primary = "Second Nav" className = "navText"/>
                                    
                                </ListItem>
                            </Link>
                            <Divider/>
                            <Link className = "anchor" to='/Summary'>
                                <ListItem button = {true}>
                                    
                                        <ListItemText primary = "Third Nav" className = "navText"/>
                                    
                                </ListItem>
                            </Link>
                            <Divider/>
                        </List>
                    
                </Drawer>
                </Hidden>
                
                <Hidden mdUp = {true}>
                    
                        <Toolbar>
                            <IconButton color="inherit" aria-label="Open drawer" onClick={this.drawerToggle} > <MenuIcon/>  </IconButton> 
                        </Toolbar> 
                    
                    <Drawer variant="temporary" anchor="left" open = {this.state.mobileOpen} onClose={this.drawerToggle} PaperProps = {{style : {width:270}}}>
                        
                            <List>
                                <ListItem>
                                    <img src = {mainLogo} alt = "logo"/>
                                    
                                </ListItem>
                            </List>
                            <List component = "nav">
                                <ListItem button = {true}>
                                    <ListItemText primary = "First Nav" />
                                </ListItem>
                                <ListItem button = {true}>
                                    <ListItemText primary = "Second Nav" />
                                </ListItem>
                                <ListItem button = {true}>
                                    <ListItemText primary = "Third Nav" />
                                </ListItem>
                                <Divider/>
                            </List>
                        
                    </Drawer>
                </Hidden>
            </div>

            
            
        );
    }
    private drawerToggle()
    {
        this.setState({
            mobileOpen: !this.state.mobileOpen
        });
        console.log(this.state.mobileOpen);
    }
}

export default SideNav;