import MomentUtils from '@date-io/moment';
import {Button, Dialog, DialogTitle, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary,IconButton, Input, InputAdornment, InputBase, InputLabel, TextField, Typography } from '@material-ui/core';
import { DateTimePicker } from 'material-ui-pickers';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment';
import MediaStreamRecorder from 'msr';
import * as React from "react";
import { isNullOrUndefined } from 'util';



interface IProps {
    focusedDays: any[],
    searchByEvent:any,
    searchAll: any, 
    userID: any
}

interface IState {
    endDate: any,
    focusedId: any,
    modalOpen: any,
    startDate: any
}
class Summary extends React.Component<IProps, IState>
{
    constructor(props:any)
    {
        super(props);
        this.state = {
            endDate: moment(), // For state of clock
            focusedId: 2,
            modalOpen: false, // For state of modal
            startDate: moment()
        }
        
        this.UpdatePost = this.UpdatePost.bind(this);
        
    }
    public render()
    {
        const handleClose = () => {
            console.log(this.state.focusedId);
            this.setState({ modalOpen: false, focusedId: null });
        };
        const handleStartDateChange = (date:any) => {
            this.setState({ startDate: date });
        };
    
        const handleEndDateChange = (date:any) => {
            this.setState({ endDate: date });
        };

        const searchByEvent = ()  => {
            const textBox = document.getElementById("event-search") as HTMLInputElement
            if (textBox === null || textBox.value === "") {
                console.log("hi");
                this.props.searchAll()  
                return;
            }
            const event = textBox.value 
            this.props.searchByEvent(event)  
        }

        const searchByEventVoice = (tag: any) =>
        {
            const mediaConstraints = {
                audio: true
            }
            const onMediaSuccess = (stream: any) => {
                const mediaRecorder = new MediaStreamRecorder(stream);
                mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
                mediaRecorder.ondataavailable = (blob: any) => {
                    mediaRecorder.stop()
                    PostAudio(blob);
                }
                mediaRecorder.start(3000);
            }
            
            navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)
        
            function onMediaError(e: any) {
                console.error('media error', e);
            }
        }

    const PostAudio = (blob: any) =>
    {
        let accessToken: any;
        fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': '7858d17484424d4d93d43c177c1268ce'
            },
            method: 'POST'
        }).then((response) => {
            // console.log(response.text())
            return response.text()
        }).then((response) => {
            console.log(response)
            accessToken = response
        }).catch((error) => {
            console.log("Error", error)
        });
           // posting audio
           fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US', {
            body: blob, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': '7858d17484424d4d93d43c177c1268ce'
            },    
            method: 'POST'
        }).then((res) => {
            return res.json()
        }).then((res: any) => {
            const textBox = document.getElementById("event-search") as HTMLInputElement
            textBox.value = (res.DisplayText as string).slice(0, -1)
        }).catch((error) => {
            console.log("Error", error)
        });
        
    }
        return(
            <div className = "detail-container">   
                <Typography variant = "h2" style = {{marginBottom:30}}>Your Diary</Typography>
                <InputLabel htmlFor = "event-search" style = {{marginTop:10}}>Event search:   </InputLabel>
                    <Input id = "event-search"  endAdornment = {
                        <InputAdornment position="end">
                            <IconButton onClick = {searchByEventVoice}>
                                <i className="fa fa-microphone" />
                            </IconButton>
                        </InputAdornment>
                    }  />
                    <Button 
                    variant="outlined"
                    color="primary"
                    className = "search-button"
                    onClick = {searchByEvent}
                    style = {{margin:10}}> Search </Button>
                <div style = {{marginTop:30}}>
                    {this.getList()}
                </div>
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        <Typography>
                            Hi
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Hi
                        </Typography>
                    </ExpansionPanelDetails>
                    <ExpansionPanelActions>
                        <Button variant="outlined" onClick = {this.handleClickOpen.bind(this,1)} color="primary">Edit</Button>
                        <Button variant = "contained" color="secondary" onClick = {this.handleClickOpen.bind(this, 1)}>Delete</Button>
                    </ExpansionPanelActions>
                    <Dialog open = {this.state.modalOpen} onClose = {handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle className = "dialog" id="form-dialog-title"> Edit your post </DialogTitle>
                            <TextField label="Event Name" id = "event-input" margin="normal" style = {{margin:16}} />
                            <MuiPickersUtilsProvider utils={MomentUtils} >
                            <DateTimePicker
                                style = {{margin:16}} 
                                label="Start Time"
                                value={this.state.startDate}
                                onChange={handleStartDateChange}
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
                                    onChange={handleEndDateChange}
                                    minDate={this.state.startDate}
                                    clearable = {true}
                                    margin = "normal"
                                    format="YYYY/MM/DD hh:mm A"
                                />
                            </MuiPickersUtilsProvider>
                            <InputBase  id = "story-input" style = {{ padding: 16, fontSize:21, boxSizing:"border-box" }} fullWidth = {true} multiline = {true} rows = "20" placeholder = "Edit your story here..."/>
                            <Button onClick = {this.UpdatePost} variant = "contained" color="primary" size = "large"> Submit</Button>
                    </Dialog>
                </ExpansionPanel>
                
            </div>
        );
    }

    private handleClickOpen (id:any) 
    {
        console.log(id);
        this.setState({ modalOpen: true, focusedId: id });
    };
    private getImages(list:any)
    {
        let mappedList:any[] = list;
        
        if(isNullOrUndefined(mappedList))
        {
            return mappedList;
        }
        mappedList = mappedList.map((object:any) => (
            <img key = {"img" + object.Id} src = {object.ImageURL} style = {{objectFit: "cover",  maxHeight: 100}}/>
        ));
        return mappedList;
    }
    
    private getList()
    {
        
        const list = this.props.focusedDays;
        // console.log("THE FOCUSED DAYS INCLUDE", list);
        const mappedList:any[] = [];
        
        if(isNullOrUndefined(list) || list.length === 0)
        {
            return mappedList;
        }
        // console.log("THE PASSED DAYS INCLUDE", list);
        for(let i = 0; i !== list.length; ++i)
        {
            // Go through each distinct day
            // Append the date using the first objects date
            mappedList.push(
            <Typography key = {"head" + i}variant = "subtitle1" style = {{marginTop: 24, marginBottom:10, textAlign: "left"}}>
            {moment(list[i][0].StartTime).format("DD/MM/YYYY")}
            </Typography>
            );
            // Append the rest of the objects
            mappedList.push(list[i].map((object:any) => (
                    <ExpansionPanel key = {"panel" + object.Id}>
                    
                        <ExpansionPanelSummary>
                            <Typography>
                                {object.EventName}
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style = {{display:"block"}}>
                            <Typography>
                                Start Time: 
                                {object.StartTime}
                            </Typography>
                            <Typography>
                                Finishing Time:
                                {object.EndTime}
                            </Typography>
                            <Typography>
                                {object.StoryUrl}
                            </Typography>
                                {
                                    this.getImages(object.Images)
                                }
                        </ExpansionPanelDetails>
                        <ExpansionPanelActions>
                            <Button variant="outlined" onClick = {this.handleClickOpen.bind(this,object.Id)} color="primary">Edit</Button>
                            <Button variant = "contained" color="secondary" onClick = {this.DeletePost.bind(this, object.Id)}>Delete</Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
            
        )));
            
        }
        
        return (mappedList);
    }

    private DeletePost(id:any)
    {
      const url = "https://msadeardiaryapi.azurewebsites.net/api/Diary/" + id;
      
      fetch(url, {
        method: 'DELETE',
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
    
    private UpdatePost()
    {
      const url = "https://msadeardiaryapi.azurewebsites.net/api/Diary/" + this.state.focusedId;
      // Get information from inputs needed to make input
      const eventInput = document.getElementById("event-input") as HTMLInputElement;
      const storyInput = document.getElementById("story-input") as HTMLInputElement;
      const startDateInput = this.state.startDate.format();
      const endDateInput = this.state.endDate.format();
      
      if(eventInput.value == null || eventInput.value === ""|| startDateInput == null || endDateInput == null)
      {
        alert("Please enter the required name and date fields");
        return;
      }
      let storyInputVal = "";
      if(storyInput.value === "" || storyInput.value == null) 
      {
        storyInputVal = "No Story Added";
      }
      else
      {
        storyInputVal = storyInput.value;
      }
      
      fetch(url, {
        body: JSON.stringify({
            "endTime": endDateInput,
            "eventName": eventInput.value,
            "id": this.state.focusedId,
            "startTime": startDateInput,
            "storyUrl": storyInputVal
        }),
        headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
          
        },
        method: 'PUT',
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

export default Summary;