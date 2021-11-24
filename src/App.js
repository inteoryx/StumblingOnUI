import './App.css';
import like from './like.svg';
import liked from './liked.svg';
import React from 'react';
import sc from './StumbleClient';

class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      history: [],
    };
  }

  componentDidMount() {
    sc.getHistory(
      0,
      (s) => this.setState({history: s.results}),
      (e) => console.log(e)
    );
  }

  render() {
    return (
      <div className="App">
        <Stumble pushHistory={(h) => {
          console.log(h);
          this.setState({history: [{url: h.url, liked: false, dislike: false}, ...this.state.history]});
          console.log(this.state.history);
        }} />
        <About />
        <History history={this.state.history} />
        <Ad />
      </div>
    );
  }
}

class Stumble extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevId: "",
      prevUrl: "",
      nextUrl: "",
      nextId: "",
      submissionUrl: "",
      submissionPlaceholder: "https://your.url.here",
      modal: false,
      modalMessage: "This is a test.",
    };

    this.updateSite = this.updateSite.bind(this);
  }

  componentDidMount() {
    this.updateSite();
  }

  updateSite() {
    if(this.state.nextId) {
      this.props.pushHistory({id: this.state.nextId, url: this.state.nextUrl});
    }

    sc.getSite(
      this.state.nextId, 
      (s) => {this.setState({nextUrl: s.url, nextId: s.siteId, prevId: this.state.nextId, prevUrl: this.state.nextUrl})},
      (e) => {console.log(e)},
    );
  }

  render() {
    return (
      <div id="stumbleSection">
        {this.state.modal && <Modal message={this.state.modalMessage} closeModal={() => this.setState({modal: false})} />}
        <button 
          id="stumbleButton"
          className="button"
          onClick={() => {
            window.open(this.state.nextUrl);
            this.updateSite();
          }}
        >STUMBLE</button>
        <div id="submissionPanel">
          <input 
            type="text" 
            id="submissionInput"
            placeholder={this.state.submissionPlaceholder}
            value={this.state.submissionUrl}
            onChange={(e) => {this.setState({submissionUrl: e.target.value.trim()})}} 
          />
          <button 
            id="submitButton"
            className="button"
            onClick={() => {
              sc.submitSite(
                this.state.submissionUrl,
                (s) => this.setState({modal: true, modalMessage: s.message, submissionUrl: ""}),
                (e) => {
                  console.log(e);
                  this.setState({modal: true, modalMessage: e.message, submissionUrl: ""});
                }
              );
            }}
          >SUBMIT</button>
        </div>
      </div>
    );
  }
}

function About() {
  return (
    <div id="aboutSection">
      <h1 className="title">StumblingOn</h1>
      <p className="text">StumblingOn shows you a random webpage whenever you click the STUMBLE button. Bored? Why not stumble on something unique?  StumblingOn is a stumble upon alternative, or clone.</p>
      <p className="text">You'll stumble on pages that are UNIQUE. Our catalog is interesting, independent, and different. We want to recapture the old, weird, and adventurous feeling of the web.</p>
      <p className="text">Submit a website. Submit YOUR website. If it's popular, pornographic, or professional, don't bother. If it's something you made and want to share - you're in exactly the right place. We'd love to have you.</p>
      <p  className="text">Follow development on <a href="https://www.youtube.com/channel/UCqYOAWurt9umvwSrTGXBykw/" target="_blank">YouTube</a></p>
      <div id="aboutLinks"><a href="https://service.stumblingon.com/metrics" target="_blank">metrics</a> <a href="https://service.stumblingon.com/docs#/" target="_blank">api</a> <a href="https://github.com/inteoryx/StumblingOnUI" target="_blank">github</a></div>
    </div>
  );
}

function History(props) {
  return (
    <div id="historySection">
      <h1 className="title">History</h1>
      <div id="historyList">
        {props.history.map((item, index) => {
          return (<HistoryItem item={item} number={index + 1} key={index} />)
        })}
      </div>
    </div>
  );
}

class HistoryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      liked: props.item.liked,
      disliked: props.item.disliked,
      mouseOverLike: false,
    };

    this.like = this.like.bind(this);
  }

  like() {
    console.log("Liking this.");
    sc.like(
      this.props.item.id,
      (s) => this.setState({liked: !this.state.liked, disliked: false}),
      (e) => console.log(e)
    );
  }

  render() {
    return (
      <div className="historyItem text">
        <div className="historySite">
          {this.props.number}. <a href={this.props.item.url}>{this.props.item.url}</a>
        </div>
        <div className="historyLike">
          <img 
            className={this.state.mouseOverLike ? "likeIcon pulse" : "likeIcon"}
            src={this.state.liked ? liked : like} 
            onClick={this.like}
            onMouseEnter={() => this.setState({mouseOverLike: true})}
            onMouseLeave={() => this.setState({mouseOverLike: false})}
          />
        </div>
        <div className="historyTalk"><a href={"https://twitter.com/search?q=" + encodeURIComponent(this.props.item.url) + "&src=typed_query&f=top"} target="_blank">Talk</a></div>
      </div>
    );
  }
}

function Modal(props){
  return (
    <div id="overlay">
      <div id="modal">
        <div id="modalText">{props.message}</div>
        <button id="modalButton" className="button" onClick={() => props.closeModal()}>OK</button>
      </div>
    </div>
  )
}

function Ad() {
  return (
    <div id="adSection">
      <h1 className="title">Ad</h1>
      <p className="text">Psst.  Hey kid.  Wanna make some money?  Like, free money?</p>
      <p className="text">Join <a href="https://crypto.com/app/9s97gpwtm3" target="_blank">crypto.com</a> with my referral code (9s97gpwtm3).  You'll get 25 dollars in cryptocurrency if you sign up.</p>
      <p className="text">Come on.  I know you're bored.  Why not waste time and money?</p>
    </div>
  );
}

export default App;
