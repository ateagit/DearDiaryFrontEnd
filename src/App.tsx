import { createMuiTheme, CssBaseline, Grid, MuiThemeProvider } from '@material-ui/core';
import moment from 'moment';
import * as React from 'react';

import { Route, Switch } from 'react-router';
import { isNullOrUndefined } from 'util';
import './App.css';
import Form from './Components/Form';
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register';
import SideNav from './Components/SideNav';
import Summary from './Components/Summary';



interface IState{
  darkMode: any,
  diaryPosts: any[],
  distinctDates: any[],
  focusedDays: any[],
  todaysPosts: any[],
  userID: any,
}

class App extends React.Component<{}, IState> {

  constructor(props:any)
  {
    super(props),
    this.state = {
      darkMode: 'light',
      diaryPosts: [],
      distinctDates:["placeholder"],
      focusedDays: [],
      todaysPosts: [],
      userID: null,
    }
    if(this.state.userID !== null)
    {
      this.GetDiaryEntries();
    }

    this.GetDiaryEntries = this.GetDiaryEntries.bind(this);  // explicitly set this in GetDiaryEntries to refer to App
    this.DistinctDates = this.DistinctDates.bind(this);
    this.GetDayEntries = this.GetDayEntries.bind(this);
    this.GetEventEntries = this.GetEventEntries.bind(this);
    this.idChange = this.idChange.bind(this);
    
  }
  public render() {
    const renderSummaryDocument = (props:any) => {
      return <Summary focusedDays = {this.state.focusedDays} searchByEvent = {this.GetEventEntries} searchAll = {this.GetDiaryEntries} userID = {this.state.userID} {...props} />
    }
    const renderLoginDocument = (props:any) => {
      return <Login idChange = {this.idChange} {...props} />
    }
    const renderHomeDocument = (props:any) => {
      return <Home userID = {this.state.userID} {...props} />
    }
    const renderFormDocument = (props:any) => {
      return <Form userID = {this.state.userID} getDates = {this.GetDiaryEntries} {...props} />
    }
    const setColourMode = () =>
    {
      console.log("hi")
        if(this.state.darkMode === 'dark')
        {
            this.setState(
              {
                darkMode: 'light'
              }
            )
        }else
        {
          this.setState(
            {
              darkMode: 'dark'
            }
          )
        }
    }
    const theme = createMuiTheme(
      { 
        palette:
        {
          type:this.state.darkMode
        }
      }
    );
    return (
      <MuiThemeProvider theme = {theme}>
        <CssBaseline />
        <div className="App">
          <Grid container = {true} alignItems = "stretch" >
            <Grid item = {true}>
            <SideNav userID = {this.state.userID} darkMode = {setColourMode} />
            </Grid>
            <Grid item = {true} sm = {true} container = {true}>
            {this.state.userID !== null ? 
            <Switch>
              <Route exact = {true} path = "/" component = {renderHomeDocument} />
              <Route path = "/Form" component = {renderFormDocument} />
              <Route path = "/Summary" render={renderSummaryDocument} />  
            </Switch>:
            <Switch>
              <Route exact = {true} path = "/" component = {renderHomeDocument} />
              <Route path = "/Login"  component = {renderLoginDocument}/>
              <Route path = "/Register"  component = {Register}/>
            </Switch>}
            
            {/*<button onClick = {this.GetDiaryEntries}>GET STUFF</button>*/}
            
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
  
  private idChange(id:any)
  {
    this.setState(
      {
        userID: id
      },
      () =>
      {
        this.GetDiaryEntries();
      }
    )
    console.log(this.state.userID);
  }
  private DistinctDates()
  {
    const url = "https://deardiaryapimsa.azurewebsites.net/api/Diary/distinctDates/" + this.state.userID;

    fetch(url, {method: 'GET'}).then(
      res => res.json()
    ).then(json =>
      {
        const distDates: any[] = [];

        json.forEach((date:any) => {

          if(moment(date).isValid())
          {
            let distinct = 1;
            for(let i = 0; i !== distDates.length; ++i)
            {
              if(moment(date, "YYYY/MM/DD hh:mm:ss A").isSame(moment(distDates[i], "YYYY/MM/DD hh:mm:ss A"), "day"))
              {
                distinct = 0;
              }
            }
            if(distinct === 1)
            {
              distDates.push(moment(date).format("YYYY/MM/DD hh:mm:ss A"))
            }
          }
           console.log("THE DISTINCT DATES ARE", distDates);
          this.setState(
            {
              distinctDates: distDates
            }
          );
        })
      }
    ).then(res =>
      {
        this.GetDayEntries();
      }
    )
  }
  private GetDayEntries()
  {
      // this.state.todaysPosts.length = 0;
      let tempSameDayArray:any[] = [];
      const tempArrayOfArrays:any[] = [];
      const distinctDays = this.state.distinctDates;
      console.log(distinctDays);
      console.log(this.state.diaryPosts);
      for(let i = 0; i !== distinctDays.length; ++i)
      {
        // Go through each distinct day
        const curDate = moment(distinctDays[i], "YYYY/MM/DD hh:mm:ss A");

        // Find which of the objects share the same distinct day, append those to an array.
        if(this.state.diaryPosts.length !== 0)
        {
          this.state.diaryPosts.forEach((post:any) => {
            if(!isNullOrUndefined(post))
            {
                // What is the start day for this object?
              const diaryDate = moment(post.StartTime, "YYYY/MM/DD hh:mm:ss A");
              
              // Check if these two dates lie on the same day
              // console.log("We are comparing", post.Id, "with time", diaryDate.format("YYYY/MM/DD"), "and", curDate.format("YYYY/MM/DD"))
              if(moment(diaryDate).isSame(curDate, 'day'))
              {
                // We found an equal day so push that object onto the array
                // console.log("Checking: ", post.Id ,diaryDate.format("YYYY/MM/DD hh:mm:ss A"), "and", curDate.format("YYYY/MM/DD hh:mm:ss A"));
                tempSameDayArray.push(post);
              }
            }
          })
        }
        
        // Push the list of objects that lie on the same day into another list
        if(!(tempSameDayArray.length === 0))
        {
          tempArrayOfArrays.push(tempSameDayArray);
          tempSameDayArray = [];
        }
        
      }
      this.setState(
      {
        focusedDays: tempArrayOfArrays
      });
  }

  private GetDiaryEntries()
  {
    const url = "https://deardiaryapimsa.azurewebsites.net/api/Diary/" + this.state.userID;
    fetch(url, {
        method: 'GET'
    }).then(res => res.json())
    .then(json => {
        this.setState(
        {
            diaryPosts: json
        },() => {
          console.log(this.state.diaryPosts);
          this.DistinctDates();
        }
        );
        console.log(this.state.diaryPosts);
         
    });
  }
  private GetEventEntries(event: any)
  {
    
    const url = "https://deardiaryapimsa.azurewebsites.net/api/Diary/SearchByEventName/" + event + "/" + this.state.userID;
      
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
  
    }).then(() => {
       this.DistinctDates();
    });
    }
}

export default App;
