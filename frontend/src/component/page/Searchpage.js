import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from '../../assets/styles/Searchpage.module.css';
import getSearchItem from "../../utils/getSearchItem";
import { useSelector } from "react-redux";
import { message } from 'antd';
import SingleVideo from "../SingleVideo";
import Video from "../Video";
function Searchpage({ handleModal }) {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');
    const token = useSelector(state => state?.loginRegister?.token);
    const [visible, setVisible] = useState(false);//视频是否可见
    const [data, setData] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);//是否播放
    const [ismuted, setIsmuted] = useState(true);//设置是否静音
    const [volume, setVolume] = useState(0);//设置音量，全局通用
    const [showComments, setShowComments] = useState(false);//是否显示评论区
    const [trueIndex, setTrueIndex] = useState(0);//点开的视频在本次搜索请求得到的数组中的真实下标
    useEffect(() => {
        message.loading({
            content: '加载中...',
            key: 'search',
            duration: 0,
        });
        getSearchItem(keyword, token).then(data => {
            switch (data.status_code) {
                case 0:
                    setData(data.video_list);
                    break;
                default:
                    message.error(data.status_msg);
                    break;
            }
            message.destroy();
        }).catch(err => {
            message.destroy();
            message.error("加载失败");
            console.log(err);
        })
        return () => {
            message.destroy();
        }
    }, [keyword, token])
    function handleClick(data,trueIndex) {
        setVisible(true);
        setTrueIndex(trueIndex);
    }
    function handleMuted() {
        if (ismuted) setVolume(0.5);
        else setVolume(0);
        setIsmuted(!ismuted);
    }
    function handleVolume(state) {
        setVolume(parseFloat(state));
        if (parseFloat(state) === 0) setIsmuted(true);
        else setIsmuted(false);
    }
    function changeVideos(trueIndex, newState, isChild = false, childName = "") {//对于搜索页、个人主页视频的sidebar以及评论操作，修改本次请求得到的数据
        if (!isChild) {
            const newVideos = data.map((item, index) => {
                return index === trueIndex ? { ...item, ...newState } : item
            });
            setData(newVideos);
        } else {
            const newVideos = data.map((item, index) => {
                return index === trueIndex ? { ...item, [childName]: { ...item[childName], ...newState } } : item//修改嵌套的数据，如video的author对象，深拷贝
            })
            setData(newVideos);
        }
    }
    return (
        <div className={styles.Searchpage}>
            {data && data.length !== 0 ?
                <div className={styles.search}>
                    {data.map((item, index) => {//此处trueIndex为视频在本次搜索请求得到的数组中的真实下标，与app.js中的全局trueIndex不同
                        //因此changevideos不可直接复用，需要重新写一个仅修改本次搜索结果的changevideos
                        return <SingleVideo key={item.id} trueIndex={index} data={data[index]} handleClick={handleClick}></SingleVideo>
                    })}
                </div> :
                <div className={styles.nothing} style={{
                    backgroundImage: `url(https://cdn.jsdelivr.net/gh/qiankun521/qiankun521@main/no-results.png)`
                }}></div>
            }
            {visible &&
                <div className={styles.video}>
                    <Video video={data[trueIndex]} isPlaying={isPlaying} handlePlaying={() => setIsPlaying(!isPlaying)} changeVideos={changeVideos}
                        ismuted={ismuted} handleMuted={handleMuted} volume={volume} handleVolume={handleVolume} trueIndex={trueIndex}
                        showComments={showComments} handleComments={() => setShowComments(!showComments)} handleModal={handleModal}
                    ></Video>
                </div>
            }
            {visible &&
                <div className={styles.closeVideo} onClick={() => {
                    setVisible(false);
                }}>✖</div>}
        </div>
    )
}
export default Searchpage;