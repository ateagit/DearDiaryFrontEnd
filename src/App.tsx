import { Grid } from '@material-ui/core';
import moment from 'moment';
import * as React from 'react';
import './App.css';
// import Form from './Components/Form';
import SideNav from './Components/SideNav';
import Summary from './Components/Summary';

interface IState{
  diaryPosts: any[],
  todaysPosts: any[],
}

class App extends React.Component<{}, IState> {

  constructor(props:any)
  {
    super(props),
    this.state = {
        diaryPosts: [],
        todaysPosts: []
    }
    this.GetDiaryEntries();
    this.GetDiaryEntries = this.GetDiaryEntries.bind(this);  // explicitly set this in GetDiaryEntries to refer to App
    this.GetTodaysEntries = this.GetTodaysEntries.bind(this);
    
  }
  public render() {
    return (
      <div className="App">
        <Grid container = {true} alignItems = "stretch" >
          <Grid item = {true}>
           <SideNav/>
          </Grid>
          <Grid item = {true} sm = {true} container = {true}>
          {/*<Form/>*/}
          <Summary todaysPosts = {this.state.todaysPosts} />
          {/*<button onClick = {this.GetDiaryEntries}>GET STUFF</button>*/}
          </Grid>
        </Grid>
      </div>
    );
  }
  
  private GetTodaysEntries()
  {
      // this.state.todaysPosts.length = 0;
      const newArray = this.state.todaysPosts;
      this.state.diaryPosts.forEach((diaryPost:any) => {
          
          if(moment(diaryPost.StartTime).isValid())
          {
              const diaryDate = moment(diaryPost.StartTime, "YYYY/MM/DD hh:mm:ss A");
              // let todaysDate = moment();

              if(moment(diaryDate).isSame(moment(), 'day'))
              {
                newArray.push(diaryPost);
                
              }
          
              
          }
          
      });
      this.setState(
        {
          todaysPosts: newArray
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
      this.GetTodaysEntries();
  });
  }
}

export default App;
