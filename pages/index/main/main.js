// pages/index/main/main.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    sidle: false,
    back: false,
    stime: false,
    userInfo: {},
    showModalStatus: false,
    swiperImg: [{
        url: '1.jpg'
      },
      {
        url: '2.jpg'
      },
      {
        url: '3.jpg'
      },
      {
        url: '4.jpg'
      },
      {
        url: '5.jpg'
      }
    ],
    video: [],
    progress: 0,
    isplay: true,
    isStop: false,
    music: {},
    playlist: [],
    loopId: null,
    playStyle: 0,
    cover: [{
        title: '云烟成雨',
        cover: '5.jpg',
        lid: '29'
      },
      {
        title: '梦想的声音',
        cover: '2.jpg',
        lid: '30'
      },
      {
        title: '最佳翻唱',
        cover: '3.jpg',
        lid: '36'
      },
      {
        title: '民谣说唱',
        cover: '4.jpg',
        lid: '32'
      },
      {
        title: '我是歌手',
        cover: '5.jpg',
        lid: '33'
      },
      {
        title: 'KTV热歌',
        cover: '2.jpg',
        lid: '35'
      },
    ],
    open: null,
    imgLazy: [true, true],
  },


  //自定义函数

  //侧滑
  touchSidle: function() {
    var that = this
    if (this.data.sidle) {
      this.setData({
        back: true,
        sidle: false,
      })
      setTimeout(function() {
        that.setData({
          stime: false
        });
        // that.update();
      }, 200);
    } else {
      this.setData({
        sidle: true,
        back: false,
        stime: true,
      })
    }
  },

  //点击切换
  changeTab: function(e) {
    this.setData({
      current: e.target.dataset.current
    })
  },

  //滑动切换
  bindChange: function(e) {
    this.setData({
      current: e.detail.current,
    });
  },

  //个人信息
  toMyinfo: function() {
    wx.navigateTo({
      url: 'user/user',
    })
  },

  //搜索
  toSearch: function() {
    wx.navigateTo({
      url: 'search/search',
    })
  },

  //upload
  upload: function() {
    wx.navigateTo({
      url: 'upload/upload',
    })
  },

  //我的音乐列表
  toMyMusic: function(e) {
    let listid = e.currentTarget.dataset.lid
    // console.log(listid)
    wx.navigateTo({
      url: 'mymusic/mymusic?listid=' + listid,
    })
  },

  //我的音乐列表
  toMyVideo: function() {
    wx.navigateTo({
      url: 'myvideo/myvideo',
    })
  },

  //toPlayer
  toPlayer: function() {
    wx.navigateTo({
      url: 'player/player',
    })
  },

  //播放视频
  toVideo: function(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    let lg = this.data.video.length
    let vname = null
    for (var i = 0; i < lg; i++) {
      if (this.data.video[i].id == id) {
        vname = this.data.video[i]
      }
    }
    //将对象转为string
    var value = JSON.stringify(vname)
    wx.navigateTo({
      url: 'video/video?video=' + value,
    })
  },

  //图片懒加载
  getScroll: function(res) {
    let that = this
    // console.log(res.detail.scrollTop);
    let count = parseInt(res.detail.scrollTop / 260);
    // console.log(count);
    that.data.imgLazy[count + 2] = true;
    that.setData({
      imgLazy: that.data.imgLazy
    })

  },


  //获取所有视频
  getAllVideo: function() {
    var that = this
    wx.request({
      url: 'https://www.mosillion.top/TestSSM/video/getAllVideo',
      success: function(res) {
        for (let i = res.data.length - 1, j = 0; i >= 0; --i, ++j) {
          let content = res.data[i]
          // console.log(res.data[i])

          let newVideo = {};
          newVideo.id = content.id
          newVideo.title = content.videoTitle
          newVideo.userimg = content.userImg
          newVideo.good = content.goodNum
          newVideo.commentNum = content.commentNum
          newVideo.video = content.video
          newVideo.nickname = content.username
          newVideo.subTime = content.subTime
          newVideo.wxNum = content.wxNum
          newVideo.islike = 0

          let newVideoList = that.data.video
          newVideoList[j] = newVideo
          that.setData({
            video: newVideoList
          })
        }
        that.getIsLike()

      }
    })
  },

  //点赞
  giveLike: function(e) {
    let id = e.target.dataset.id
    let videoList = this.data.video
    let lg = this.data.video.length
    let ass = 0
    for (var p = 0; p < lg; ++p) {
      if (videoList[p].id == id) {
        if (videoList[p].islike == 1) {
          ass = 0
          videoList[p].islike = 0
            --videoList[p].good
        } else {
          ass = 1
          videoList[p].islike = 1
            ++videoList[p].good
        }
        this.setData({
          video: videoList
        })

        break
      }

    }

    wx.request({
      url: 'https://www.mosillion.top/TestSSM/comment/giveLike',
      data: {
        id: id + '',
        username: this.data.userInfo.nickName,
        userImg: this.data.userInfo.avatarUrl,
        islike: ass,
        wxNum: this.data.open,
      },
      success: function() {
        // console.log("dianzanle")
      }
    })
  },

  //获取点赞状态
  getIsLike: function() {
    var that = this
    wx.request({
      url: 'https://www.mosillion.top/TestSSM/comment/findIsLike',
      data: {
        wxNum: this.data.open,
      },
      success: function(res) {
        // console.log(res.data)
        let newVideoList = that.data.video
        // console.log(newVideoList)
        let lg = that.data.video.length

        for (var i = 0; i < res.data.length; i++) {
          let id = parseInt(res.data[i].videoId)
          let islike = parseInt(res.data[i].isLike)
          for (var j = 0; j < lg; j++) {
            if (newVideoList[j].id == id) {
              newVideoList[j].islike = islike
              break
            }
          }
        }

        that.setData({
          video: newVideoList
        })


      }
    })
  },


  //播放音乐
  playMusic: function(e) {
    console.log(backgroundAudioManager.paused)

    if (backgroundAudioManager.paused) {
      if (this.data.isStop) {
        this.setData({
          isStop: false
        })
        backgroundAudioManager.title = this.data.music.name
        backgroundAudioManager.singer = this.data.music.author
        backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + this.data.music.img % 100 + '/300_albumpic_' + this.data.music.img + '_0.jpg'
        backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + this.data.music.url + '.m4a?fromtag=0&guid=126548448'
      } else {
        backgroundAudioManager.play()
        this.setData({
          isplay: true
        })
      }
    } else {
      backgroundAudioManager.pause()
      this.setData({
        isplay: false
      })
    }
  },

  //获取当前播放音乐
  getPlayMuscic: function() {
    var that = this
    wx.getStorage({
      key: 'music',
      success: function(res) {
        let musica = JSON.parse(res.data)
        that.setData({
          music: musica,
        })
        that.getList()
        // console.log('a')
      }
    })
  },

  //从本地获取播放列表
  getList: function() {
    var that = this
    wx.getStorage({
      key: 'playlist',
      success: function(res) {
        let pllist = JSON.parse(res.data)
        that.setData({
          playlist: pllist
        })
        that.addMusicToList()
        // console.log('b')
        that.setPlaylistToLocal()
        that.judgeLoodId()
      },
    })

  },

  //向list中添加当前播放音乐
  addMusicToList: function() {
    var that = this
    let mus = this.data.music
    let newlist = this.data.playlist
    let isRepeat = false
    for (let i = 0; i < newlist.length; i++) {
      if (mus.url == newlist[i].url) {
        isRepeat = true
      }
    }
    if (!isRepeat) {
      let len = newlist.length
      newlist[len] = mus
      that.setData({
        playlist: newlist
      })
    }
  },

  //将playlist存入本地
  setPlaylistToLocal: function() {
    var that = this
    let newlist = JSON.stringify(this.data.playlist)
    wx.setStorage({
      key: 'playlist',
      data: newlist,
    })
    // console.log(this.data.music)
    // console.log(this.data.playlist)
  },

  //判断当前播放歌曲在列表中的位置
  judgeLoodId: function() {
    let music = this.data.music
    let list = this.data.playlist
    for (let i = 0; i < list.length; i++) {
      if (music.url == list[i].url) {
        this.setData({
          loopId: i
        })
      }
    }
  },

  //改变播放方式
  changePlayStyle: function() {
    if (this.data.playStyle == 0) {
      // console.log('d')
      wx.showToast({
        title: '单曲循环',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        playStyle: 1
      })
      wx.setStorage({
        key: 'playStyle',
        data: 1,
      })
    } else if (this.data.playStyle == 1) {
      // console.log('s')
      wx.showToast({
        title: '列表顺序',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        playStyle: 2
      })
      wx.setStorage({
        key: 'playStyle',
        data: 2,
      })
    } else if (this.data.playStyle == 2) {
      // console.log('x')
      wx.showToast({
        title: '列表随机',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        playStyle: 0
      })
      wx.setStorage({
        key: 'playStyle',
        data: 0,
      })
    }
  },

  //随机播放
  randomPlay: function() {
    let list = this.data.playlist
    let len = list.length
    let rnum = Math.floor(Math.random() * len);
    // console.log(rnum);
    this.setData({
      music: this.data.playlist[rnum]
    })
    backgroundAudioManager.title = this.data.playlist[rnum].name
    backgroundAudioManager.singer = this.data.playlist[rnum].author
    backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + this.data.playlist[rnum].img % 100 + '/300_albumpic_' + this.data.playlist[rnum].img + '_0.jpg'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + this.data.playlist[rnum].url + '.m4a?fromtag=0&guid=126548448'

    this.judgeLoodId()
  },

  //循环播放
  loopPlay: function() {
    let loopId = this.data.loopId
    if (loopId == this.data.playlist.length - 1) {
      this.setData({
        loopId: 0
      })
    } else {
      this.setData({
        loopId: ++loopId
      })
    }
    this.setData({
      music: this.data.playlist[this.data.loopId]
    })
    backgroundAudioManager.title = this.data.playlist[this.data.loopId].name
    backgroundAudioManager.singer = this.data.playlist[this.data.loopId].author
    backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + this.data.playlist[this.data.loopId].img % 100 + '/300_albumpic_' + this.data.playlist[this.data.loopId].img + '_0.jpg'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + this.data.playlist[this.data.loopId].url + '.m4a?fromtag=0&guid=126548448'

  },

  //单曲循环
  loopSingle: function() {
    backgroundAudioManager.title = this.data.music.name
    backgroundAudioManager.singer = this.data.music.author
    backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + this.data.music.img % 100 + '/300_albumpic_' + this.data.music.img + '_0.jpg'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + this.data.music.url + '.m4a?fromtag=0&guid=126548448'
  },

  //删除播放列表中的某首歌
  deleteList: function(e) {
    let did = e.currentTarget.dataset.did
    let list = this.data.playlist
    if (this.data.music.url == list[did].url) {
      this.setData({
        music: {}
      })
      wx.setStorage({
        key: 'music',
        data: {},
      })
      backgroundAudioManager.stop()

    } else {}
    list.splice(did, 1)
    this.setData({
      playlist: list
    })
    wx.setStorage({
      key: 'playlist',
      data: JSON.stringify(list),
    })
    this.judgeLoodId()
  },

  //清空播放列表
  clearPlaylist: function() {
    backgroundAudioManager.stop()
    this.setData({
      playlist: [],
      music: {},
      loopId: null
    })
    wx.setStorage({
      key: 'music',
      data: {},
    })
    wx.setStorage({
      key: 'playlist',
      data: JSON.stringify([]),
    })
  },

  //播放列表切歌
  cutSong: function(e) {
    let cutid = e.currentTarget.dataset.cutid
    // console.log(cutid)
    let cutmusic = this.data.playlist[cutid]
    // console.log(cutmusic)
    this.setData({
      music: cutmusic
    })
    wx.setStorage({
      key: 'music',
      data: JSON.stringify(cutmusic)
    })
    this.judgeLoodId()
    backgroundAudioManager.title = cutmusic.name
    backgroundAudioManager.singer = cutmusic.author
    backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + cutmusic.img % 100 + '/300_albumpic_' + cutmusic.img + '_0.jpg'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + cutmusic.url + '.m4a?fromtag=0&guid=126548448'
  },

  //判断是否正在播放
  isOrNorPlay: function() {
    if (backgroundAudioManager.paused) {
      this.setData({
        isplay: false
      })
      console.log('aaa')
    } else {
      this.setData({
        isplay: true
      })
      console.log('bbb')
    }
  },

  //更多设置（弹出底部框体）
  moreSetting: function() {
    wx.showActionSheet({
      itemList: ['分享此条动态', '隐藏此条动态', '举报'],
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          onShareAppMessage()
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this

    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
          open: res.data.openId
        })
      },
    })

    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
              that.setData({
                userInfo: res.userInfo,
              })
              // console.log(res)
            }
          })
        }
      }
    })



    //获取播放信息，播放列表流程
    this.getPlayMuscic();
    // console.log(this.data.loopId)

    //获取视频列表
    this.getAllVideo();

    wx.getStorage({
      key: 'playStyle',
      success: function(res) {
        that.setData({
          playStyle: res.data
        })
      },
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    //进入小程序默认开始播放
    backgroundAudioManager.title = this.data.music.name
    backgroundAudioManager.singer = this.data.music.author
    backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + this.data.music.img % 100 + '/300_albumpic_' + this.data.music.img + '_0.jpg'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + this.data.music.url + '.m4a?fromtag=0&guid=126548448'

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    //获取视频列表
    this.getAllVideo();

    this.getPlayMuscic();
    this.isOrNorPlay();

    //背景音频播放进度更新事件
    backgroundAudioManager.onTimeUpdate(() => {
      this.setData({
        progress: ((backgroundAudioManager.currentTime / backgroundAudioManager.duration) * 100).toFixed(7)
      })

    })

    //播放结束
    backgroundAudioManager.onEnded(() => {
      this.setData({
        isplay: false
      })
      wx.showToast({
        title: '播放结束',
        icon: 'none',
        duration: 2000
      })
      if (this.data.playStyle == 2) {
        this.loopPlay()
        let loopId = this.data.loopId
        wx.setStorage({
          key: 'music',
          data: JSON.stringify(this.data.playlist[loopId]),
        })
      } else if (this.data.playStyle == 1) {
        this.loopSingle()
      } else if (this.data.playStyle == 0) {
        this.randomPlay()
        let loopId = this.data.loopId
        wx.setStorage({
          key: 'music',
          data: JSON.stringify(this.data.playlist[loopId]),
        })
      }
    })

    //监听播放错误
    backgroundAudioManager.onError(() => {
      this.setData({
        isplay: false
      })

      wx.showToast({
        title: '播放错误',
        icon: 'none',
        duration: 2000
      })
    })

    //背景音频进入可以播放状态，但不保证后面可以流畅播放
    backgroundAudioManager.onCanplay(() => {
      this.setData({
        isplay: true
      })
      wx.showToast({
        title: '即将播放',
        icon: 'none',
        duration: 2000
      })
    })

    //音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
    backgroundAudioManager.onWaiting(() => {
      this.setData({
        isplay: true
      })
      wx.showToast({
        title: '网络状态不好',
        icon: 'none',
        duration: 2000
      })
    })

    //上一首
    backgroundAudioManager.onPrev(() => {
      let loopId = this.data.loopId
      if (loopId == 0) {
        this.setData({
          loopId: this.data.playlist.length - 1
        })
      } else {
        this.setData({
          loopId: --loopId
        })
      }
      this.setData({
        music: this.data.playlist[this.data.loopId]
      })
      backgroundAudioManager.title = this.data.playlist[this.data.loopId].name
      backgroundAudioManager.singer = this.data.playlist[this.data.loopId].author
      backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + this.data.playlist[this.data.loopId].img % 100 + '/300_albumpic_' + this.data.playlist[this.data.loopId].img + '_0.jpg'
      backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + this.data.playlist[this.data.loopId].url + '.m4a?fromtag=0&guid=126548448'

      let loopId1 = this.data.loopId
      wx.setStorage({
        key: 'music',
        data: JSON.stringify(this.data.playlist[loopId1]),
      })
    })

    //下一首
    backgroundAudioManager.onNext(() => {
      let loopId = this.data.loopId
      if (loopId == this.data.playlist.length - 1) {
        this.setData({
          loopId: 0
        })
      } else {
        this.setData({
          loopId: ++loopId
        })
      }
      this.setData({
        music: this.data.playlist[this.data.loopId]
      })
      backgroundAudioManager.title = this.data.playlist[this.data.loopId].name
      backgroundAudioManager.singer = this.data.playlist[this.data.loopId].author
      backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + this.data.playlist[this.data.loopId].img % 100 + '/300_albumpic_' + this.data.playlist[this.data.loopId].img + '_0.jpg'
      backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + this.data.playlist[this.data.loopId].url + '.m4a?fromtag=0&guid=126548448'

      let loopId2 = this.data.loopId
      wx.setStorage({
        key: 'music',
        data: JSON.stringify(this.data.playlist[loopId2]),
      })

    })



    //监听播放暂停事件
    backgroundAudioManager.onPause(() => {
      this.setData({
        isplay: false
      })
    })

    //监听开始播放事件
    backgroundAudioManager.onPlay(() => {
      this.setData({
        isplay: true
      })
    })

    //播放停止
    backgroundAudioManager.onStop(() => {
      this.setData({
        isplay: false,
        isStop: true
      })
      wx.showToast({
        title: '播放停止',
        icon: 'none',
        duration: 2000
      })
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    backgroundAudioManager.stop()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },



  //down-box
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 300, //动画时长  
      timingFunction: "linear", //线性  
      delay: 0, //0则不延迟 
      transformOrigin: "left bottom 9.5%",
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停  
    animation.translateY(350).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function() {
      // 执行第二组动画：Y轴不偏移，停  
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭抽屉  
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },

})