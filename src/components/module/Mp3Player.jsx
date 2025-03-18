import React, { useRef, useState } from "react";

const Mp3Player = ({filemp3}) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Xử lý khi nhạc bắt đầu phát
  const playAudio = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  // Xử lý khi tạm dừng nhạc
  const pauseAudio = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Xử lý khi dừng nhạc (quay về đầu)
  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setProgress(0);
    setIsPlaying(false);
  };

  // Tua lùi 5 giây
  const rewindAudio = () => {
    audioRef.current.currentTime -= 5;
  };

  // Tua tới 5 giây
  const forwardAudio = () => {
    audioRef.current.currentTime += 5;
  };

  // Cập nhật tiến trình phát nhạc
  const updateProgress = () => {
    const current = audioRef.current.currentTime;
    setCurrentTime(current);
    setProgress((current / duration) * 100);
  };

  // Khi nhạc tải xong, lấy tổng thời gian bài hát
  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  // Khi người dùng thay đổi progress bar
  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Hàm định dạng thời gian (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
        <div>
            {filemp3===null ? "Không có thoại":(                
                <div style={styles.container}>  
                {/* <div>{filemp3}</div>    */}
                <audio
                  ref={audioRef}
                  onTimeUpdate={updateProgress}
                  onLoadedMetadata={onLoadedMetadata}
                >
                  <source src={filemp3} type="audio/mpeg" />
                  Trình duyệt của bạn không hỗ trợ audio.
                </audio>
                <div style={styles.controls}>
                  <button onClick={rewindAudio}>⏪ -5s</button>
                  {isPlaying ? (
                    <button onClick={pauseAudio}>⏸️ Pause</button>
                  ) : (
                    <button onClick={playAudio}>▶️ Play</button>
                  )}
                  <button onClick={stopAudio}>⏹️ Stop</button>
                  <button onClick={forwardAudio}>⏩ +5s</button>
                </div>
          
                {/* Thanh tiến trình */}
                <div style={styles.progressContainer}>
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    style={styles.progressBar}
                  />
                  <span>{formatTime(duration)}</span>
                </div>
          
              </div>
            )}
        </div>
        
    
  );
};

// CSS styles cho giao diện
const styles = {
  container: {
    textAlign: "center",
    marginTop: "20px",
    padding: "20px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    width: "400px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
  },
  controls: {
    marginTop: "10px",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  progressBar: {
    width: "60%",
  },
};

export default Mp3Player;
