import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  state = {
    status: 'off',
    time: 1200,
    timer: null,
  };
  pad0 = (num) => {
    if(num > 9) return num;
    else return `0${num}`;
  };
      
  formatTime = (time) => {
    //if(!time || typeof time !== 'number' || time < 0 ) return null;

    const minutes = Math.floor(time / 60);
    const seconds = time - (minutes * 60); 
      
    return `${pad0(minutes)}:${pad0(seconds)}`;
  };
  step = () => {};
  startTimer() {
    this.setState({
      time: 1200,
      timer: setInterval(this.step, 1000),
      status: 'work',
    });
  };
  render() {
    const { status, time } = this.state;
    const {formatTime, startTimer} = this;
    return (
      <div>
        <h1>Protect your eyes</h1>
        <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
        <p>This app will help you track your time and inform you when it's time to rest.</p>
        {(status === 'work') && <img src="./images/work.png" />}
        {(status === 'rest') && <img src="./images/rest.png" />}
        {(status !== 'off') && <div className="timer">{formatTime(time)}</div>}
        {(status === 'off') && <button className="btn" onClick={startTimer}>Start</button>}
        {(status !== 'off') && <button className="btn">Stop</button>}
        <button className="btn btn-close">X</button>
      </div>
    )
  }
};

render(<App />, document.querySelector('#app'));
