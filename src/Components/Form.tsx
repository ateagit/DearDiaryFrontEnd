import MomentUtils from '@date-io/moment';
import { TextField } from '@material-ui/core';

import { DateTimePicker } from 'material-ui-pickers';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment';
import * as React from "react";

moment.locale('fr');

interface IAppState 
{
    
    clearedDate: null,
    diaryPosts: any[],
    selectedDate: any,
    uploadFileList: any // This will hold the file lit. This includes the file name [0], last modified date, size and so on.
  
}

class Form extends React.Component<{}, IAppState>
{
    constructor(props: any)
    {
        super(props);
        this.state =
        {
            clearedDate: null,
            diaryPosts: [],
            selectedDate: new Date(),
            uploadFileList: null
        }

        this.UploadPost = this.UploadPost.bind(this); // this returns a new function in which the keyword 'this' always refers to App (which is 'this')
        this.FileUpload = this.FileUpload.bind(this); // explicitly set this in GetDiaryEntries to refer to App
    }
    // private handleDateChange = (date:any) => {
     //   this.setState({ selectedDate: date });
    // };
    
    
    public render()
    {
        return(
            <form style = {{padding:20, width:"100%"}}>
                <TextField label="Event Name" id = "event-input" margin="normal" inputProps = {{style:{fontSize:30}}}/>
                <TextField inputProps = {{style:{fontSize:30, lineHeight:1}}} fullWidth = {true} multiline = {true} rows = "20"/>
                <MuiPickersUtilsProvider utils={MomentUtils} >
                <DateTimePicker
            value={this.state.clearedDate}
            onChange={this.handleClearedDateChange}
            style={{fontSize:30, lineHeight:1}}
            clearable = {true}
          />
          </MuiPickersUtilsProvider>
                {/*
                <label>Event Name</label>
                <input type="text" id = "event-input" placeholder = "Your Title Here"/>
                <label>Your Story </label>
                <input type = "text" id = "story-input" placeholder = "Begin your story here"/>
                <label>Starting Date </label>
                <input type = "datetime-local" id = "startdate-input"/>
                <label>Ending Date </label>
                <input type = "datetime-local" id = "enddate-input"/>
                <label>Images</label> 
                <input type = "file" onChange = {this.FileUpload} id = "image-input"/>
                <button type = "button" onClick = {this.UploadPost}>Upload</button> */}
            </form>
        );
    }
    private handleClearedDateChange = (date:any) => {
        this.setState({ clearedDate: date });
        };
    private FileUpload(fileList: any)
    {
        console.log(fileList.target.files[0]);
        // this, is the object that "owns" the JavaScript code.
        this.setState({
        uploadFileList: fileList.target.files
        });
    }

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

export default Form;