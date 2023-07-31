import React, { Component } from 'react';
import styles from './StopWatch.module.css';

class StopWatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(0, 0, 0, 0, 0, 0),
      btnStartVisible: true,
      laps: [],
      isPaused: false,
      lastLapTime: null,
    };
    this.idInterval = null;
  }
  start = () => {
    this.idInterval = setInterval(() => {
      const { time } = this.state;
      const newTime = new Date(time.getTime() + 1000);
      this.setState({ time: newTime })
    }, 1000);

    this.setState({ btnStartVisible: false });
  }
  stop = () => {
    if (this.state.isPaused) {
      this.setState({ btnText: 'ПАУЗА', isPaused: false }, () => {
        this.idInterval = setInterval(() => {
          const { time } = this.state;
          const newTime = new Date(time.getTime() + 1000);
          this.setState({ time: newTime });
        }, 1000);
      });
    } else {
      clearInterval(this.idInterval);
      this.idInterval = null;
      this.setState({ btnText: 'ПРОДОЛЖИТЬ', isPaused: true });
    }
  }
  lap = () => {
    if (!this.state.isPaused) {
      const { time } = this.state;
      const lapTime = time.toLocaleTimeString('en-GB');
      const lapDate = new Date().toLocaleString('en-GB');
      this.setState((prevState) => ({
        laps: [
          ...prevState.laps,
          {
            id: prevState.laps.length + 1,
            elapsedTime: this.getElapsedTime(),
            time: lapTime,
            date: lapDate,
          },
        ],
        lastLapTime: new Date(),
      }));
    } else {
      clearInterval(this.idInterval);
      this.idInterval = null;
      this.setState({ time: new Date(0, 0, 0, 0, 0, 0) });
    }
  }
  clearLaps = () => {
    this.setState({ laps: [] });
  }
  getElapsedTime = () => {
    const { lastLapTime } = this.state;
    if (!lastLapTime) {
      return '00:00:00';
    }
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - lastLapTime);
    return elapsedTime.toISOString().substr(11, 8);
  }

  render() {
    const { btnStartVisible, laps, isPaused } = this.state;
    return (
      <div>
        <h1 className={styles.h1style}>{this.state.time.toLocaleTimeString('en-GB')}</h1>
        {btnStartVisible ? (
          <button className={styles.btnStart} onClick={this.start}>СТАРТ</button>
        ) : (
          <>
            <button className={`${styles.btnPauseOrResume} ${isPaused ? styles.btnColorResume : styles.btnColorStop}`} onClick={this.stop}>{isPaused ? 'ПРОДОЛЖИТЬ' : 'ПАУЗА'}</button>
            <button className={`${styles.btnLapOrReset} ${isPaused ? styles.btnColorReset : styles.btnColorLap}`} onClick={this.lap}>{isPaused ? 'СБРОС' : 'КРУГ'}</button>
          </>
        )}

        <table className={styles.tableLapsList}>
          <thead>
            <tr>
              <th>#</th>
              <th>ВРЕМЯ ПРОХОЖДЕНИЯ КРУГА</th>
              <th>ИСТЕКШЕЕ ВРЕМЯ</th>
              <th>ТЕКУЩЕЕ ВРЕМЯ</th>
            </tr>
          </thead>
          <tbody>
            {laps.map((lapData, index) => (
              <tr key={lapData.id}>
                <td>{index + 1}</td>
                <td>{lapData.elapsedTime}</td>
                <td>{lapData.time}</td>
                <td>{lapData.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {laps.length > 0 && (
          <button className={styles.clearLaps} onClick={this.clearLaps}>УДАЛИТЬ ДАННЫЕ</button>
        )}

      </div>
    );
  }
}

export default StopWatch;
