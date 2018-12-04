// pages/index/main/mymusic/mymusic.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allMusic: [],
    page:2,
    playlist: [],
  },
  //播放音乐
  toPlay: function (e) {
    let id = e.currentTarget.dataset.mid
    let music = this.data.allMusic[id]
    var valmusic = JSON.stringify(music)
    // wx.reLaunch({
    //   url: '../main'
    // })
                                                                                                       
    backgroundAudioManager.title = music.name
    backgroundAudioManager.singer = music.author
    backgroundAudioManager.coverImgUr = music.img
    backgroundAudioManager.src =music.url 

    wx.setStorage({
      key: "music",
      data: valmusic
    })

    //加入本地播放列表
    this.getList(music);

  },

  //从本地获取播放列表
  getList: function (e) {
    var that = this
    wx.getStorage({
      key: 'playlist',
      success: function (res) {
        let pllist = JSON.parse(res.data)
        that.setData({
          playlist: pllist
        })
        that.addMusicToList(e)
        // console.log('b')
        that.setPlaylistToLocal()
      },
    })

  },

  //向list中添加当前播放音乐
  addMusicToList: function (e) {
    var that = this
    let mus = e
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
  setPlaylistToLocal: function () {
    var that = this
    let newlist = JSON.stringify(this.data.playlist)
    wx.setStorage({
      key: 'playlist',
      data: newlist,
    })
    // console.log(this.data.music)
    // console.log(this.data.playlist)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    let listid=e.lid
    // console.log(listid)
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    wx.request({
      url: 'https://api.bzqll.com/music/tencent/songList?key=579621905',
      data: {
        id:listid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res)
        let allMusic=[]
        let list = res.data.data.songs
        for (let i = 0; i<list.length;i++)
        {
            let music = {}
            music.name=list[i].name
            music.author = list[i].singer
            music.url = list[i].url
            music.img = list[i].pic
            music.lrc = list[i].lrc
            music.id=list[i].id
            music.from = 'tencent'
            allMusic[i]=music
        }
        that.setData({
          allMusic:allMusic
        })
        wx.hideLoading()
      }
    })


    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})