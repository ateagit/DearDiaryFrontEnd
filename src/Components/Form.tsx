import MomentUtils from '@date-io/moment';
import { Button, Grid, InputBase, List,  ListItemText , TextField} from '@material-ui/core';
// import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import NavigationIcon from '@material-ui/icons/Navigation';
import { DateTimePicker } from 'material-ui-pickers';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment';
import * as React from "react";
import Dropzone from 'react-dropzone'
import { isNullOrUndefined } from 'util';

interface IAppState 
{
    diaryPosts: any[],
    endDate: any,
    startDate: any,
    uploadFileList: any[] // This will hold the file lit. This includes the file name [0], last modified date, size and so on.
  
}

class Form extends React.Component<{}, IAppState>
{
    constructor(props: any)
    {
        super(props);
        this.state =
        {
            diaryPosts: [],
            endDate: moment(),
            startDate: moment(),
            uploadFileList: [] // a list of files to upload
        }
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleStartDateChange = this.handleEndDateChange.bind(this);
        this.UploadPost = this.UploadPost.bind(this); // this returns a new function in which the keyword 'this' always refers to App (which is 'this')
        this.FileUpload = this.FileUpload.bind(this); // explicitly set this in GetDiaryEntries to refer to App
        this.onDrop = this.onDrop.bind(this);
    }
    // private handleDateChange = (date:any) => {
     //   this.setState({ selectedDate: date });
    // };
    
    
    public render()
    {
        return(
            <form style = {{padding:30}} className = "form">
                <Grid container = {true} direction="column"  alignItems="flex-start" justify="flex-start">
                    <Grid item = {true}>
                        <TextField label="Event Name" id = "event-input" margin="normal" style = {{margin:16}} />
                    </Grid>

                    <Grid container = {true} item = {true} >
                        <MuiPickersUtilsProvider utils={MomentUtils} >
                            <DateTimePicker
                                style = {{margin:16}} 
                                label="Start Time"
                                value={this.state.startDate}
                                onChange={this.handleStartDateChange}
                                clearable = {true}
                                margin = "normal"
                                format="YYYY/MM/DD hh:mm A"
                            />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={MomentUtils} >
                            <DateTimePicker
                                style = {{margin:16}}
                                label="End Time"
                                value={this.state.endDate}
                                onChange={this.handleEndDateChange}
                                minDate={this.state.startDate}
                                clearable = {true}
                                margin = "normal"
                                format="YYYY/MM/DD hh:mm A"
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>

                </Grid>    
                <InputBase  id = "story-input" style = {{ padding: 16, fontSize:21, boxSizing:"border-box" }} fullWidth = {true} multiline = {true} rows = "20" placeholder = "Start your story here..."/>
                <Dropzone accept = 'image/*' onDropAccepted = {this.onDrop} className = "dropzone">
                    <Grid container = {true} direction="column" justify="center" alignItems="center" >
                        <CloudUploadIcon />
                        <List dense = {true} disablePadding = {true}>
                            <ListItemText primary = "Upload Images" style = {{padding:0}}/>
                            {
                            this.state.uploadFileList.map((f:any) => <ListItemText style = {{textAlign:"center"}} key={f.name} secondary = {f.name}/>)
                            }
                            
                        </List>
                    </Grid>
                
                </Dropzone>
                
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
                <Button onClick = {this.UploadPost} variant = "extendedFab" color="secondary" style = {{position: "fixed", bottom: 25, right: 25, minHeight:75, minWidth:75, fontSize: 15,fontWeight:600}}>
                    <NavigationIcon style = {{fontSize: 30, marginRight: 5}} />
                    Add to diary
                </Button>
            </form>
        );
    }
    private handleStartDateChange = (date:any) => {
        this.setState({ startDate: date });
    };

    private handleEndDateChange = (date:any) => {
        this.setState({ endDate: date });
    };

    private onDrop(fileList:any)
    {
        this.setState(
            {
                uploadFileList: fileList
            }
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

    private UploadPost()
    {
      const url = "https://msadeardiaryapi.azurewebsites.net/api/Diary/Upload";
      console.log("hi");
      // Get information from inputs needed to make input
      const eventInput = document.getElementById("event-input") as HTMLInputElement;
      const storyInput = document.getElementById("story-input") as HTMLInputElement;
      const startDateInput = this.state.startDate.format();
      const endDateInput = this.state.endDate.format();
      const imageInput = this.state.uploadFileList;
        console.log(eventInput.value);
      if(eventInput.value == null || eventInput.value === ""|| startDateInput == null || endDateInput == null)
      {
        alert("Please enter the required name and date fields");
        return;
      }
      const formData = new FormData();
      
      formData.append("Event", eventInput.value);
      console.log(storyInput.value);
      if(storyInput.value === "" || storyInput.value == null) 
      {
          formData.append("Story", "No Story Added");
      }
      else
      {
        formData.append("Story", storyInput.value);
      }
      formData.append("StartTime", startDateInput);
      formData.append("EndTime", endDateInput);
      if(!isNullOrUndefined(imageInput))
      {
        imageInput.forEach((file:any) => {
            formData.append("Images", file)
        });
      }

      
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