import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';



class Album extends Component {
   constructor(props) {
      super(props);
 
     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });
 
     this.state = {
       album: album,
       currentSong: album.songs[0],
       currentTime: 0,
       volume: .3,
       duration: album.songs[0].duration,
       isPlaying: false,
       isEntered: false
     };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;
     this.audioElement.volume = this.state.volume;
    
    }

    componentDidMount() {
      this.eventListeners = {
        timeupdate: e => {
          this.setState({ currentTime: this.audioElement.currentTime });
        },
        durationchange: e => {
          this.setState({ duration: this.audioElement.duration });
        }
      };
      this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.addEventListener('durationChange', this.eventListeners.durationchange);
    }

    componentWillUnmount() {
      this.audioElement.src = null;
      this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    }

    formatTime(time) {
      if(isNaN(time)) {return "-:--"; }
      const min = Math.floor(time);
      const timeMin = Math.floor(time/60);
      const timeSec = min % 60;
      let timeString = timeMin + ':' + timeSec;
      return timeString;
    }

    handleSongClick(song) {
      const isSameSong = this.state.currentSong === song;
      if(this.state.isPlaying && isSameSong) {
        this.pause();
      } else {
        if (!isSameSong) { this.setSong(song);}
        this.play();
      }
    }

    handlePreviousClick(){
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex= Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleNextClick(){
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex= Math.min((this.state.album.songs.length - 1),currentIndex +1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleTimeChange(e) {
      const newTime = this.audioElement.duration * e.target.value;
      this.audioElement.currentTime = newTime;
      this.setState({ currentTime: newTime });
    }

    handleVolumeChange(e) {
      const newVolume = e.target.value;
      this.audioElement.volume = newVolume;
      this.setState({ volume: newVolume });
    }

    play () { 
      this.audioElement.play();
      this.setState({isPlaying: true});
    }

    pause () {
      this.audioElement.pause();
      this.setState({ isPlaying: false}); 
    }

    setSong(song) {
      this.audioElement.src = song.audioSrc;
      this.setState({ currentSong: song });
    }
  
  render () {
    return(
      <section className="album">
        <section id="album-info">
                <img 
                  id="album-cover-art" 
                  src={this.state.album.albumCover} 
                  alt={this.state.album.title}
                />
                <div className="album-details">
                  <h1 id="album-title">{this.state.album.title}</h1>
                  <h2 className="artist">{this.state.album.artist}</h2>
                  <div id="release-info">{this.state.album.releaseInfo}</div>
                </div>
         </section>
              <table id="song-list" align="center" className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
                  <colgroup>
                    <col id="song-number-column" />
                    <col id="song-title-column" />
                    <col id="song-name-column" />
                    <col id="song-length-column" />
                    <col id="song-duration-column" />
                  </colgroup>  
                <tbody>
                  {
                    this.state.album.songs.map( (song, index) =>
                      <tr 
                        className="song" 
                        key={index} 
                        onClick={() => this.handleSongClick(song)}
                        onMouseEnter={() => this.setState({isEntered: index+1})}
                        onMouseLeave={() => this.setState({isEntered: false})}

                      >
                        <td>
                          <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                            {(this.state.currentSong.title === song.title)?
                              <span className={this.state.isPlaying ? "ion-md-pause" : "ion-md-play"}/>
                              :
                              (this.state.isEntered === index+1) ? 
                              <span className="ion-md-play"></span>
                              :
                              <span className="song-number">{index+1}</span>
                            }
                            </button>
                        </td>
                        <td>Title:</td>
                        <td>{song.title}</td>
                        <td>Length:</td>
                        <td>{this.formatTime(song.duration)}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            <PlayerBar 
              isPlaying={this.state.isPlaying} 
              currentSong={this.state.currentSong}
              currentTime={this.audioElement.currentTime}
              duration={this.audioElement.duration}
              volume={this.state.volume}
              formatTime={(e) => this.formatTime(e)}
              handleSongClick={() => this.handleSongClick(this.state.currentSong)}
              handlePreviousClick={() => this.handlePreviousClick()}
              handleNextClick={() => this.handleNextClick()}
              handleTimeChange={(e) => this.handleTimeChange(e)}
              handleVolumeChange={(e) => this.handleVolumeChange(e)}
            />
      </section>
    );
  }
}

export default Album;