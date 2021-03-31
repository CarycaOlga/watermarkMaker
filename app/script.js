import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  state = {
    status: 'off',
    time: 1200,
    timer: null,
  };
      
  formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    minutes = minutes.toString().padStart(2, "0");
    sec = sec.toString().padStart(2, "0");

    return `${minutes}:${sec}`;
  };
  step = () => {};
  startTimer = () => {
    this.setState({
      time: 1200,
      timer: setInterval(this.step, 1000),
      status: 'work',
    });
  };
  render() {
    const { status } = this.state;
    return (
      <div>
        <h1>Protect your eyes</h1>
        <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
        <p>This app will help you track your time and inform you when it's time to rest.</p>
        {(status === 'work' && <img src="./images/work.png" />)}
        {(status === 'rest' && <img src="./images/rest.png" />)}
        {(status !== 'off' && <div className="timer">{this.formatTime(this.state.time)}</div>)}
        {(status === 'off' && <button className="btn" onClick={this.startTimer}>Start</button>)}
        {(status !== 'off' && <button className="btn">Stop</button>)}
        <button className="btn btn-close">X</button>
      </div>
    )
  }
};

render(<App />, document.querySelector('#app'));
