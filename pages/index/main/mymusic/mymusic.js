// pages/index/main/mymusic/mymusic.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allMusic: [],

  },
  //
  toPlay: function (e) {
    let id = e.currentTarget.dataset.mid
    let music = this.data.allMusic[id]
    var valmusic = JSON.stringify(music)
    // wx.reLaunch({
    //   url: '../main'
    // })
                                                                                                       
    backgroundAudioManager.title = music.name
    backgroundAudioManager.singer = music.author
    backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + music.img % 100 + '/300_albumpic_' + music.img + '_0.jpg'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + music.url + '.m4a?fromtag=0&guid=126548448'

    wx.setStorage({
      key: "music",
      data: valmusic
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    let listid=e.listid
    // console.log(listid)
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid='+listid, //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let allMusic=[]
        let list = res.data.songlist
        for (let i = 0; i<list.length;i++)
        {
            let music = {}
            music.name=list[i].data.songname
            music.author = list[i].data.singer[0].name
            music.url = list[i].data.songmid
            music.img = list[i].data.albumid
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