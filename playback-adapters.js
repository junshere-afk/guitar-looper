/* Common playback API. Neither adapter owns the audio routing used for recording. */
(()=>{
'use strict';
class YouTubePlayback {
  constructor(player, states){this.player=player;this.states=states}
  play(){this.player.playVideo()}
  pause(){this.player.pauseVideo()}
  seek(seconds){this.player.seekTo(Math.max(0,seconds),true)}
  getTime(){return Number(this.player.getCurrentTime())||0}
  getDuration(){return Number(this.player.getDuration())||0}
  isPlaying(){return this.player.getPlayerState()===this.states.PLAYING}
  setRate(rate){this.player.setPlaybackRate(rate)}
  getRate(){return Number(this.player.getPlaybackRate())||1}
  setVolume(value){this.player.setVolume(Math.max(0,Math.min(100,value)))}
  getVolume(){return Number(this.player.getVolume())}
  isMuted(){return this.player.isMuted()}
  unmute(){this.player.unMute()}
}
class LocalAudioPlayback {
  constructor(audio,onError=()=>{}){this.audio=audio;this.onError=onError;audio.preservesPitch=true}
  play(){const result=this.audio.play();if(result?.catch)result.catch(this.onError);return result}
  pause(){this.audio.pause()}
  seek(seconds){this.audio.currentTime=Math.max(0,Math.min(Number.isFinite(this.audio.duration)?this.audio.duration:Infinity,seconds))}
  getTime(){return Number(this.audio.currentTime)||0}
  getDuration(){return Number.isFinite(this.audio.duration)?this.audio.duration:0}
  isPlaying(){return !this.audio.paused&&!this.audio.ended}
  setRate(rate){this.audio.preservesPitch=true;this.audio.playbackRate=rate}
  getRate(){return this.audio.playbackRate}
  setVolume(value){this.audio.volume=Math.max(0,Math.min(100,value))/100}
  getVolume(){return Math.round(this.audio.volume*100)}
  isMuted(){return this.audio.muted}
  unmute(){this.audio.muted=false}
}
// Compatibility layer lets the existing looper send one command set to either source.
class PlaybackFacade {
  constructor(adapter,states){this.adapter=adapter;this.states=states}
  playVideo(){return this.adapter.play()}
  pauseVideo(){return this.adapter.pause()}
  seekTo(time){return this.adapter.seek(time)}
  getCurrentTime(){return this.adapter.getTime()}
  getDuration(){return this.adapter.getDuration()}
  getPlayerState(){return this.adapter.isPlaying()?this.states.PLAYING:this.states.PAUSED}
  setPlaybackRate(rate){return this.adapter.setRate(rate)}
  getPlaybackRate(){return this.adapter.getRate()}
  setVolume(volume){return this.adapter.setVolume(volume)}
  getVolume(){return this.adapter.getVolume()}
  isMuted(){return this.adapter.isMuted()}
  unMute(){return this.adapter.unmute()}
  cueVideoById(id){return this.adapter.player?.cueVideoById(id)}
  getVideoData(){return this.adapter.player?.getVideoData()||{}}
}
globalThis.GuitarLooperPlayback={YouTubePlayback,LocalAudioPlayback,PlaybackFacade};
})();
