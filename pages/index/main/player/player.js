// pages/index/main/player/player.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
var moment = require('../../../../utils/moment.js');

var query = wx.createSelectorQuery();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    music: {},
    isplay: true,
    progress: 0,
    currentTime: '00:00',
    duration: '00:00',
    isStop: false,
    playlist: [],
    playStyle: 0,
    loopId: null,
    max: 0,
    lyric: [],
    lyricChange: 1,
    lineNO: 0,
  },

  //歌词封面切换
  lyricChangeEvent: function() {
    if (this.data.lyricChange == 1) {
      this.setData({
        lyricChange: 2
      })
    } else {
      this.setData({
        lyricChange: 1
      })
    }
  },

  //判断是否正在播放
  isOrNorPlay: function() {
    if (backgroundAudioManager.paused) {
      this.setData({
        isplay: false
      })
    } else {
      this.setData({
        isplay: true
      })
    }
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
        backgroundAudioManager.coverImgUr =  this.data.music.img
        backgroundAudioManager.src =  this.data.music.url 
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

  //滑动改变播放进度
  changeMusicTime: function(e) {
    var value = e.detail.value
    // console.log(value)
    backgroundAudioManager.seek(Math.floor(value))

    // this.timeLyric()

    this.setData({
      progress: value
    })
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

  //随机播放
  randomPlay: function() {
    let list = this.data.playlist
    let len = list.length
    let rnum = Math.floor(Math.random() * len);
    // console.log(rnum);
    this.setData({
      music: this.data.playlist[rnum]
    })
    this.getLyric()
    backgroundAudioManager.title = this.data.playlist[rnum].name
    backgroundAudioManager.singer = this.data.playlist[rnum].author
    backgroundAudioManager.coverImgUr =  this.data.playlist[rnum]
    backgroundAudioManager.src =this.data.playlist[rnum].url 

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
    this.getLyric()
    backgroundAudioManager.title = this.data.playlist[this.data.loopId].name
    backgroundAudioManager.singer = this.data.playlist[this.data.loopId].author
    backgroundAudioManager.coverImgUr = this.data.playlist[this.data.loopId].img 
    backgroundAudioManager.src = this.data.playlist[this.data.loopId].url


  },

  //单曲循环
  loopSingle: function() {
    backgroundAudioManager.title = this.data.music.name
    backgroundAudioManager.singer = this.data.music.author
    backgroundAudioManager.coverImgUr = this.data.music.img 
    backgroundAudioManager.src = this.data.music.url 

  },


  //获取歌词
  getLyric: function() {
    let that = this
    wx.request({
      url: that.data.music.lrc,
      success: function (res) {
        // console.log(res);
        let medisArray = []
        let medis = res.data
        let medises = medis.split("\n")

        for (var i = 0; i < medises.length; i++) {
          let item = medises[i]
          let t = item.substring(item.indexOf("[") + 1, item.indexOf("]"))

          medisArray[i] = {
            t: (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3),
            c: item.substring(item.indexOf("]") + 1, item.length)
          }
        }

        that.setData({
          lyric: medisArray
        }) 
      }
    })
  },

  //上一曲
  prevMusic: function() {

    this.setData({
      lineNO: 0
    })

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
    this.getLyric()
    backgroundAudioManager.title = this.data.playlist[this.data.loopId].name
    backgroundAudioManager.singer = this.data.playlist[this.data.loopId].author
    backgroundAudioManager.coverImgUr = this.data.playlist[this.data.loopId].img 
    backgroundAudioManager.src =this.data.playlist[this.data.loopId].url 

    let loopId1 = this.data.loopId
    wx.setStorage({
      key: 'music',
      data: JSON.stringify(this.data.playlist[loopId1]),
    })



  },


  //下一曲
  nextMusic: function() {

    this.setData({
      lineNO: 0
    })

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
    this.getLyric()
    backgroundAudioManager.title = this.data.playlist[this.data.loopId].name
    backgroundAudioManager.singer = this.data.playlist[this.data.loopId].author
    backgroundAudioManager.coverImgUr = this.data.playlist[this.data.loopId].img 
    backgroundAudioManager.src = this.data.playlist[this.data.loopId].url

    let loopId2 = this.data.loopId
    wx.setStorage({
      key: 'music',
      data: JSON.stringify(this.data.playlist[loopId2]),
    })



  },

  //判断歌曲进度与歌词跳转
  timeLyric: function() {
    // console.log(this.data.lyric)
    let j = this.data.lineNO

    for (var i = 0; i < this.data.lyric.length; i++) {
      // console.log("abc")
      if (parseFloat(this.data.lyric[i].t) <= backgroundAudioManager.currentTime.toFixed(3) && backgroundAudioManager.currentTime.toFixed(3) <= parseFloat(this.data.lyric[i + 1].t)) {
        // console.log(parseFloat(this.data.lyric[i].t))
        // console.log(backgroundAudioManager.currentTime.toFixed(3))
        // console.log(parseFloat(this.data.lyric[i + 1].t))
        // console.log("i=" + i)
        this.setData({
          lineNO: i+1 
        })
        break
      }


      // console.log('4521548')
    }
  },


  // //下载歌曲
  // downSong:function(){
  //   wx.downloadFile({
  //     url: 'http://ws.stream.qqmusic.qq.com/C100' + this.data.music.url + '.m4a?fromtag=0&guid=126548448',
  //     success:function(res){
  //       if (res.statusCode === 200) {
  //         wx.playVoice({
  //           filePath: res.tempFilePath
  //         })
  //         console.log('sss')
  //       }
  //     },
  //     fail:function(){
  //       console.log('aaa')
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.getStorage({
      key: 'music',
      success: function(res) {
        that.setData({
          music: JSON.parse(res.data)
        })

        that.getLyric();

      }
    })

    this.isOrNorPlay()



    wx.getStorage({
      key: 'playStyle',
      success: function(res) {
        that.setData({
          playStyle: res.data
        })
      },
    })

    wx.getStorage({
      key: 'playlist',
      success: function(res) {
        that.setData({
          playlist: JSON.parse(res.data)
        })
        that.judgeLoodId()
      },
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    this.setData({
      duration: moment.unix(backgroundAudioManager.duration).format('mm:ss'),
      max: backgroundAudioManager.duration
    })

    //背景音频播放进度更新事件
    backgroundAudioManager.onTimeUpdate(() => {
      this.setData({
        currentTime: moment.unix(backgroundAudioManager.currentTime).format('mm:ss'),
        duration: moment.unix(backgroundAudioManager.duration).format('mm:ss'),
        progress: backgroundAudioManager.currentTime,
        max: backgroundAudioManager.duration
      })

      let lineNo = this.data.lineNO
      let medisArray = this.data.lyric


      this.timeLyric()
      
    
    })

    //播放结束
    backgroundAudioManager.onEnded(() => {
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


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    })

    this.timeLyric()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

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

  }
})