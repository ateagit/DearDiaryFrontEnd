import { Grid } from '@material-ui/core';
import * as React from 'react';
import './App.css';
import SideNav from './Components/SideNav';
import Form from './Components/Form';



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
    this.FileUpload = this.FileUpload.bind(this);

    this.UploadPost = this.UploadPost.bind(this); // this returns a new function in which the keyword 'this' always refers to App (which is 'this')

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
          <Form></Form>
          <button onClick = {this.GetDiaryEntries}>GET STUFF</button>
          </Grid>
        </Grid>
      </div>
      
      
    );
  }
  
  private FileUpload(fileList: any)
  {
    console.log(fileList.target.files[0]);
    // this, is the object that "owns" the JavaScript code.
    this.setState({
      uploadFileList: fileList.target.files
    });
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
  // POST request for uploading data
  private UploadPost()
  {
    const url = "https://msadeardiaryapi.azurewebsites.net/api/Diary/Upload";
    
    // Get information from inputs needed to make input
    const eventInput = document.getElementById("event-input") as HTMLInputElement;
    const storyInput = document.getElementById("story-input") as HTMLInputElement;
    const startDateInput = document.getElementById("startdate-input") as HTMLInputElement;
    const endDateInput = document.getElementById("enddate-input") as HTMLInputElement;
    const imageInput = this.state.uploadFileList[0];
    
    if(eventInput == null || storyInput == null || startDateInput == null || endDateInput == null || imageInput == null)
    {
      return;
    }
    const formData = new FormData();

    formData.append("Event", eventInput.value);
    formData.append("Story", storyInput.value);
    formData.append("StartTime", startDateInput.value);
    formData.append("EndTime", endDateInput.value);
    formData.append("Images", imageInput);
    
    fetch(url, {
			body: formData,
      headers: {
        'cache-control': 'no-cache', 
      },
      method: 'POST',
		})
      .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
        console.log("yeboi");
				location.reload()
			}
		  })
  }
}

export default App;
