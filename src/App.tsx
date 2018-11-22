import { Grid } from '@material-ui/core';
import moment from 'moment';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import Form from './Components/Form';
import SideNav from './Components/SideNav';
import Summary from './Components/Summary';


interface IState{
  diaryPosts: any[],
  distinctDates: any[],
  focusedDays: any[]
  todaysPosts: any[]
}

class App extends React.Component<{}, IState> {

  constructor(props:any)
  {
    super(props),
    this.state = {
        diaryPosts: [],
        distinctDates:["placeholder"],
        focusedDays: [],
        todaysPosts: []
    }
    this.GetDiaryEntries();

    this.GetDiaryEntries = this.GetDiaryEntries.bind(this);  // explicitly set this in GetDiaryEntries to refer to App
    this.DistinctDates = this.DistinctDates.bind(this);
    this.GetDayEntries = this.GetDayEntries.bind(this);
    
  }
  public render() {
    const renderDocument = (props:any) => {
      return <Summary focusedDays = {this.state.focusedDays} {...props} />
   }
    return (
      <div className="App">
        <Grid container = {true} alignItems = "stretch" >
          <Grid item = {true}>
           <SideNav/>
          </Grid>
          <Grid item = {true} sm = {true} container = {true}>
          <Switch>
            <Route path = "/Form" component = {Form} />
            <Route path = "/Summary" render={renderDocument} />
            {/*<Summary focusedDays = {this.state.focusedDays}/>*/}
          </Switch>
          
          {/*<button onClick = {this.GetDiaryEntries}>GET STUFF</button>*/}
          
          </Grid>
        </Grid>
      </div>
    );
  }
  
  private DistinctDates()
  {
    const url = "https://msadeardiaryapi.azurewebsites.net/api/Diary/distinctDates";

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

      for(let i = 0; i !== distinctDays.length; ++i)
      {
        // Go through each distinct day
        const curDate = moment(distinctDays[i], "YYYY/MM/DD hh:mm:ss A");

        // Find which of the objects share the same distinct day, append those to an array.

        this.state.diaryPosts.forEach((post:any) => {
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
        })
        // Push the list of objects that lie on the same day into another list
        tempArrayOfArrays.push(tempSameDayArray);
        tempSameDayArray = [];
      }
      this.setState(
      {
        focusedDays: tempArrayOfArrays
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
      this.DistinctDates();
  });
  }
}

export default App;
