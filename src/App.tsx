import { Grid } from '@material-ui/core';
import * as React from 'react';
import './App.css';
import Form from './Components/Form';
import SideNav from './Components/SideNav';




interface IAppState 
{
  diaryPosts: any[],
  uploadFileList: any // This will hold the file lit. This includes the file name [0], last modified date, size and so on.
}

class App extends React.Component<{}, IAppState> {
  constructor(props:any)
  {
    super(props);
    this.state = {
      diaryPosts: [],
      uploadFileList: null
    }
    // this refers to the object that owns the js code.
    // in this.FileUpload, it refers to the App class as this instance of App class owns that code.
    // If we didnt bind this, then when calling FileUpload, this would be set to null as no object
    // owns the js code as function called it. Hence we change what this refers to always point to
    // App.
    this.GetDiaryEntries();
    
    this.GetDiaryEntries = this.GetDiaryEntries.bind(this); // explicitly set this in GetDiaryEntries to refer to App
  }

  
  
  
  public render() {
    return (
     
      
      <div className="App">
        <Grid container = {true} alignItems = "stretch">
          <Grid item = {true}>
           <SideNav/>
          </Grid>
          <Grid item = {true} sm = {true} container = {true}>
          <Form/>
          <button onClick = {this.GetDiaryEntries}>GET STUFF</button>
          </Grid>
        </Grid>
      </div>
      
      
    );
  }
  
  

  private GetDiaryEntries()
  {
    const url = "https://msadeardiaryapi.azurewebsites.net/api/Diary";
    fetch(url, {
      method: 'GET'
    }).then(res => res.json())
    .then(json => {
      this.setState(
        {
          diaryPosts: json
        }
      );
      console.log(this.state.diaryPosts);
    });
  }
  
}

export default App;
