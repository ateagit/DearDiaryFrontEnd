import {ExpansionPanel,ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';

import * as React from "react";


interface IProps {
    todaysPosts: any[]
}
class Summary extends React.Component<IProps, {}>
{
    constructor(props:any)
    {
        super(props);
        
        // this.getList = this.getList.bind(this);
        
    }
    public render()
    {
        return(
            <div className = "detail-container">   
                <Typography variant = "h2" style = {{marginBottom:30}}>Your Diary</Typography>
                <Typography variant = "subtitle1" style = {{marginBottom:10, textAlign: "left"}}>Today</Typography>
                <div>
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
                </ExpansionPanel>
                
            </div>
        );
    }
    
    private getList()
    {
        console.log(this.props.todaysPosts.length);
        const list = this.props.todaysPosts;
        let mappedList:any[] = [];
        if(list == null)
        {
            return mappedList;
        }
        console.log("posts", list);
        mappedList = list.map((object) => (
            <ExpansionPanel key = {"panel" + object.Id}>
                <ExpansionPanelSummary>
                    <Typography>
                        {object.EventName}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        Hi
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        ));
        console.log(mappedList)
        return (mappedList);
    }
    
    
}

export default Summary;