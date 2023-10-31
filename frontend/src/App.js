import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mainpage from './component/page/Mainpage';
import Header from './component/Header';
import getVideo from './utils/getVideos';
function App() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    async function get() {
      const newVideo = await getVideo();
      setVideos(newVideo);
      localStorage.setItem('videos', JSON.stringify(newVideo));
    }
    const localVideo = localStorage.getItem('videos');
    if (localVideo) {
      get();
    }// eslint-disable-next-line
  }, [])
  return (
    <Router>
      <div className="App">
        <Header></Header>
        <Routes>
          <Route path='/' element={<Mainpage videos={videos}></Mainpage>}></Route>
        </Routes>
      </div>
    </Router>

  );
}

export default App;