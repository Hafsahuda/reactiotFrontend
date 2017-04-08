import React, { Component } from 'react';
import './App.css';
var Sent;
const ONE_SECOND = 1000;

class App extends Component {
  constructor() {
    // In a constructor, call `super` first if the class extends another class
    super();
    this.state = {
      meh: '',
      Last:[],
      All:[]
     };

    this.handleLast = this.handleLast.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
  }
componentDidMount(){
  fetch('https://api.thingspeak.com/channels/223568/feed.json?api_key=O44CKCJLHR39Y8NR',
  {
    method:'GET',
  })
  .then(response=>response.json())
  .then((json)=>this.setState({All:json}))
  .then(this.handleLast())
  .then(this.handleAll());
}


  handleLast(){
    var that = this;
    fetch('https://api.thingspeak.com/channels/223568/feed/last.json?api_key=O44CKCJLHR39Y8NR',
    {
      method:'GET',
    })
    .then(response=>response.json())
    .then((json)=>this.setState({Last:json}))
    .then(function(){
      var indicate = (that.state.Last.field1=="001")?"Full":"Empty";
      if(indicate=="Full"){
        that.handleEmail();
        console.log("yyy");
        document.getElementById('EmailSent').style.display ="block";
      }
    });
  }

  handleAll(e){
    var all = this.state.All;
    if(all.length!=0){
      var list = all.map(function(a,b){
        var day = this.handleDate(a.created_at);
      })
    };
  }

  handleDate(e){
    if(e){
      var day = e.split('T');
      return day;
    }
  }

  handleTime(e){
    var hours = e.slice(0,e.indexOf(':'));
    hours=parseInt(hours)+5;
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutes=e.slice(e.indexOf(':')+1,e.lastIndexOf(':'))
    minutes = parseInt(minutes)+30
    if(minutes > 59)
    {
      minutes = parseInt(minutes)-60;
      hours = parseInt(hours)+1;
    }
    if(minutes<10){
      minutes = "0" + minutes;
    }
    if(hours<10){
      hours = "0"+ hours;
    }
    var e = hours + ':' + minutes+' '+ ampm;
  //  this.setState({meh:true});
    return e;
  }

  handleEmail(){
    var indicate = JSON.stringify({
      indicate:"1"
    });

    var json = this.state.Last;
    var that = this;
    fetch('http://localhost:9000/Email',
    {
      method: 'GET',
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
     })
     .then(function(response){
       if(response.status==200){
         console.log("ok");
         Sent="Sent";
       }
       else{
         console.log("noo");
         Sent="Failed"
       }
     })
  }

  render() {
    var all = this.state.All;
    //Last feed
    var fDay = this.handleDate(this.state.Last.created_at);
    if(fDay){
      var lTime = this.handleTime(fDay[1]);
      var lDay = fDay[0];
    }
    var lEid = this.state.Last.entry_id;
    var lBin = (this.state.Last.field1=="001")?"fa fa-trash":"fa fa-trash-o";
    var indicate = (this.state.Last.field1=="001")?"Full":"Empty";

    //All feed
    if(all){
      var info = [all].map(function(a,b){
      //  console.log(a.feeds);
        if(a.feeds){
          a.feeds.reverse();
        var feed = a.feeds.map(function(c,d){

          var aDay = this.handleDate(c.created_at);
          if(aDay){
            var aTime = this.handleTime(aDay[1]);
          //  aTime.setMinutes()(aTime.getMinutes()+30);
          //  aTime.setHours()(aTime.getHours()+5);
            var bDay = aDay[0];
          }
          var aEid = c.entry_id;
          var aBin = (c.field1=="001")?"fa fa-trash":"fa fa-trash-o";
          var aindicate = (c.field1=="001")?"Full":"Empty";

           return(
             <div key={d}>
               <div className="col-sm-3 centr"><span className = "bolt">Entry Id :</span> {aEid}</div>
               <div className="col-sm-3 centr"><span className = "bolt">Date :</span> {bDay}</div>
               <div className="col-sm-3 centr"><span className = "bolt">Time :</span> {aTime}</div>
               <div className="col-sm-3 " ><span className = "bolt">Status :</span><i className={aBin} aria-hidden="true"></i><span className = {aindicate}>{aindicate}</span></div>
             </div>
           );
      },this)
    }
    return(
      <div key = {b}>{feed}</div>
    );
  },this)
    }

    return (
      <div className="App">
        <div className="container">
            <div className="row">
              <div className="col-sm-12 center"><h1 className= "boltr">Garbage Monitoring System</h1></div>
                <div className="col-sm-6">
                    <div className="lastFeed">
                      <h2 className= "boltr">Entry Id : {lEid}</h2>
                      <div ><span className = "bolt" >Date : </span> {lDay} </div>
                      <div><span className = "bolt">Time : </span> {lTime}</div>
                      <div><span className = "bolt">Status: </span> <span className={indicate}>{indicate}</span></div>
                      <div id= "EmailSent"><span className = "bolt">Email: </span> <span className="Empty bolt">Sent</span></div>
                    </div>
                </div>
                <div className="col-sm-6 bin">
                    <i className={lBin} aria-hidden="true"></i>
                </div>
                <div className="col-sm-12 center">
                  <h2 className="boltr center">Graph</h2>
                    <iframe id="graph" src="https://thingspeak.com/channels/223568/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=20&type=line"></iframe>
                </div>
              </div>
          </div>
              <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="All">
                        <h2 className="boltr mar">All Entries :</h2>
                        {info}
                      </div>
                    </div>
                  </div>
              </div>
      </div>
    );
  }
}

export default App;
