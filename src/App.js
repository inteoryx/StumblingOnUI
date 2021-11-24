import './App.css';
import like from './like.svg';
import liked from './liked.svg';
import React from 'react';
import sc from './StumbleClient';

function isValidHttpUrl(string) {
  let url;
  

  return url.protocol === "http:" || url.protocol === "https:";
}


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
              
              try {
                const url = new URL(this.state.submissionUrl);
              } catch (_) {
                this.setState({modal: true, modalMessage: "Please enter a valid URL."});
                return false;  
              }

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
      <p className="text">Click STUMBLE get a random webpage.  Explore unique independent websites.  It's the old, weird, and adventurous feeling of the web.  Explore random webpages.</p>
      <p className="text">Submit a website. Submit YOUR website. Nothing popular, pornographic, or professional. Made something and want to share? You're in exactly the right place. We'd love to have you.</p>
      <p className="text">You might think StumblingOn is a Stumble Upon alternative or Stumble Upon clone.  I agree and hope google returns it as the first result for "Stumble Upon Alternative"</p>
      <p  className="text">Follow development on <a href="https://www.youtube.com/channel/UCqYOAWurt9umvwSrTGXBykw/" target="_blank" rel="noreferrer">YouTube</a></p>
      <div id="aboutLinks"><a href="https://service.stumblingon.com/metrics" target="_blank" rel="noreferrer">metrics</a> <a href="https://service.stumblingon.com/docs#/" target="_blank" rel="noreferrer">api</a> <a href="https://github.com/inteoryx/StumblingOnUI" target="_blank" rel="noreferrer">github</a></div>
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

    // Set state before network call.  Network call will correct if it fails.
    const prev = this.state.liked;
    this.setState({liked: true});

    sc.like(
      this.props.item.id,
      (s) => {this.setState({liked: s.liked, disliked: false})},
      (e) => {
        console.log(e);
        this.setState({liked: prev});
      }
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
            alt={this.state.liked ? "A filled heart.  You liked this." : "A clear heart, awaiting a click, to indicate you like this."} 
            onClick={this.like}
            onMouseEnter={() => this.setState({mouseOverLike: true})}
            onMouseLeave={() => this.setState({mouseOverLike: false})}
          />
        </div>
        <div className="historyTalk"><a href={"https://twitter.com/search?q=" + encodeURIComponent(this.props.item.url) + "&src=typed_query&f=top"} target="_blank" rel="noreferrer">Talk</a></div>
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
      <p className="text">Join <a href="https://crypto.com/app/9s97gpwtm3" target="_blank" rel="noreferrer">crypto.com</a> with my referral code (9s97gpwtm3).  You'll get 25 dollars in cryptocurrency if you sign up.</p>
    </div>
  );
}

export default App;
