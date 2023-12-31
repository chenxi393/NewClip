/**
 * @file 侧边栏组件
 * @module Sidebar
 */
import styles from '../assets/styles/Sidebar.module.css';
import { HeartFilled } from '@ant-design/icons';
import { BiSolidCommentDots } from 'react-icons/bi';
import { BiSolidShare } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { postLike, postCancelLike } from '../utils/postLike';
import { postFollow, postCancelFollow } from '../utils/postFollow';
import { Popover, message } from 'antd';
import { useNavigate } from 'react-router';
import SharePopover from './SharePopover';
/**
 * 侧边栏组件
 * @param {Object} props - 组件属性
 * @param {Object} props.video - 当前播放的视频信息
 * @param {Function} props.handleComments - 处理评论的函数
 * @param {Function} props.handleModal - 处理登录注册模态框的函数
 * @param {number} props.trueIndex - 视频在列表中的真实索引
 * @param {Function} props.changeVideos - 改变本地视频信息的函数
 * @returns {JSX.Element} 侧边栏组件
 */
function Sidebar({ video, handleComments, handleModal, trueIndex, changeVideos }) {
    const logout = useSelector(state => state?.loginRegister?.logout);
    const token = useSelector(state => state?.loginRegister?.token);
    const id = useSelector(state => state?.loginRegister?.user_id);
    const navigate = useNavigate();
    /**
     * 处理点赞事件
     * @function
     * @memberof module:Sidebar
     * @returns {void}
     */
    function handleLike() {
        if (logout) handleModal();
        else {
            if (video?.is_favorite) postCancelLike(video?.id, token).then(res => {
                switch (res.status_code) {
                    case 0:
                        // changeVideos(trueIndex, 'favorite_count', parseInt(video.favorite_count - 1))
                        // changeVideos(trueIndex, "is_favorite", !video.is_favorite);
                        // react中设置状态为异步，连续设置状态时，会出现问题
                        changeVideos(trueIndex, {
                            favorite_count: parseInt(video.favorite_count - 1),
                            is_favorite: !video.is_favorite
                        })
                        break;
                    case -1:
                        message.error({
                            content: res.status_msg,
                            key: 'like',
                            duration: 1,
                        });
                        break;
                    default:
                        message.error({
                            content: '取消点赞失败',
                            key: 'like',
                            duration: 1,
                        });
                        break;
                }
            }).catch(err => {
                message.error({
                    content: '取消点赞失败,请检查网络',
                    key: 'like',
                    duration: 1,
                });
                console.log(err);
            })
            else postLike(video?.id, token).then(res => {
                switch (res.status_code) {
                    case 0:
                        // changeVideos(trueIndex, 'favorite_count', parseInt(video.favorite_count + 1))
                        // changeVideos(trueIndex, "is_favorite", !video.is_favorite);
                        changeVideos(trueIndex, {
                            favorite_count: parseInt(video.favorite_count + 1),
                            is_favorite: !video.is_favorite
                        })
                        break;
                    case -1:
                        console.log(res.status_msg);
                        message.error({
                            content: res.status_msg,
                            key: 'like',
                            duration: 1,
                        });
                        break;
                    default:
                        message.error({
                            content: '点赞失败',
                            key: 'like',
                            duration: 1,
                        });
                        break;
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }

    /**
     * 处理关注/取消关注事件
     * @param {Event} e - 事件对象
     * @returns {void}
     */
    function handleFollow(e) {
        e.stopPropagation();
        if (logout) handleModal();
        else {
            if (video.author.is_follow) postCancelFollow(video.author.id, token).then(res => {
                switch (res.status_code) {
                    case 0:
                        changeVideos(trueIndex, {
                            follower_count: parseInt(video.author.follower_count - 1),
                            is_follow: !video.author.is_follow
                        }, true, "author")
                        break;
                    case -1:
                        console.log(res.status_msg);
                        message.error({
                            content: res.status_msg,
                            key: 'follow',
                            duration: 1,
                        });
                        break;
                    default:
                        message.error({
                            content: '取消关注失败',
                            key: 'follow',
                            duration: 1,
                        });
                        break;
                }
            }).catch(err => {
                message.error({
                    content: '取消关注失败,请检查网络',
                    key: 'follow',
                    duration: 1,
                });
                console.log(err);
            })
            else postFollow(video.author.id, token).then(res => {
                switch (res.status_code) {
                    case 0:
                        changeVideos(trueIndex, {
                            follower_count: parseInt(video.author.follower_count + 1),
                            is_follow: !video.author.is_follow
                        }, true, "author")
                        break;
                    case -1:
                        message.error({
                            content: res.status_msg,
                            key: 'follow',
                            duration: 1,
                        });
                        break;
                    default:
                        message.error({
                            content: '关注失败',
                            key: 'follow',
                            duration: 1,
                        });
                        break;
                }
            }).catch(err => {
                message.error({
                    content: '取消关注失败,请检查网络',
                    key: 'follow',
                    duration: 1,
                });
                console.log(err);
            })
        }
    }

    function handleUserpage() {
        navigate(`/personal/?user_id=${video?.author?.id}`)
    }
    
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebar}>
                <div className={styles.avatar} style={{
                    backgroundImage: `url(${video?.author?.avatar})`,
                    backgroundSize: 'cover',
                }} onClick={handleUserpage}>
                    {id !== video?.author?.id &&
                        <div className={video?.author?.is_follow ? styles.followed : styles.follow} onClick={e => handleFollow(e)}>{video?.author?.is_follow ? "✔" : "+"}</div>
                    }
                </div>
                <div className={styles.like}>
                    <div><HeartFilled className={`${video?.is_favorite && styles.liked} ${styles.icon}`} onClick={handleLike} /></div>
                    <div className={styles.number}>{video?.favorite_count}</div>
                </div>
                <div className={styles.comment}>
                    <div><BiSolidCommentDots className={styles.icon} onClick={handleComments} /></div>
                    <div className={styles.number}>{video?.comment_count}</div>
                </div>
                <Popover content={<SharePopover video={video}></SharePopover>} trigger="hover" placement='right'>
                    <div className={styles.share}>
                        <div><BiSolidShare className={styles.icon}/></div>
                        <div className={styles.number}>{video?.share_count}</div>
                    </div>
                </Popover>
            </div>
        </div>
    )
}
export default Sidebar;