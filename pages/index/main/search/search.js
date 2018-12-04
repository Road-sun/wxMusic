// pages/index/main/search/search.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reconmmend:["周杰伦","派克特","薛之谦","杨超越",'中国新说唱','Black Sheep'],
    allMusic:[],
    isSearch:false,
    key:null,
    val:null,
    page: 2,
    allMusicNum:null,
    songbook:null,
    playlist: [],
  },

//改变曲库
  songChange:function(e){
    if (e.detail.value){
      this.setData({
        songbook:1
      })
      wx.setStorage({
        key: 'songbook',
        data: 1,
      })
    }else{
      this.setData({
        songbook: 0
      })
      wx.setStorage({
        key: 'songbook',
        data: 0,
      })
    }
  },

  getHostSearchWord:function(){
    var that=this
      wx.request({
        url: 'https://www.mosillion.top/TestSSM/hostSearch/getHostWord',
        success:function(res){
          // console.log(res.data)
          let host=res.data.host
          if(host!=[]){
            that.setData({
              reconmmend: host
            })
          }   
        }
      })
  },

  
  //点击播放
  toPlay: function(e) {
    let id = e.currentTarget.dataset.mid
    let music = this.data.allMusic[id]
    var valmusic = JSON.stringify(music)
    // wx.reLaunch({
    //   url: '../main',
    // })

    backgroundAudioManager.title = music.name
    backgroundAudioManager.singer = music.author
    backgroundAudioManager.coverImgUr =  music.img 
    backgroundAudioManager.src = music.url
    
    wx.setStorage({
      key: "music",
      data: valmusic
    })

    //加入本地播放列表
    this.getList(music);

    //写入热搜词
    wx.request({
      url: 'https://www.mosillion.top/TestSSM/hostSearch/addHostWord',
      data:{
        value:music.name
      },
      success: function (res) {

      }
    })

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

  //搜索
  search:function(e){
    let val = e.detail.value
    let  geturl=null;
    let songfrom=null;
    if(this.data.songbook){
      geturl ='https://api.bzqll.com/music/netease/search';
      songfrom ='netease'
    } else{
      geturl = 'https://api.bzqll.com/music/tencent/search';
      songfrom = 'tencent'
    }
    this.setData({
      val:val,
      page:2
    })
    var that=this
    if(val){
      wx.request({
        url: geturl,
        data: {
          key:579621905,
          s: val,
          type:'song',
          limit:20,
          offset: '1'
        },
        method:'GET',
        dataType:'json',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // console.log(res)
          let allMusic = []
          let list = res.data.data
          for (let i = 0; i < list.length; i++) {
            let music = {}
            music.name = list[i].name
            music.author = list[i].singer
            music.url = list[i].url
            music.img = list[i].pic
            music.lrc=list[i].lrc
            music.id=list[i].id
            music.from=songfrom
            allMusic[i] = music
          }
          that.setData({
            isSearch: true,
            allMusic: allMusic,
          })
        }
      })
    }else{
      that.setData({
        isSearch: false,
        allMusic: []
      })
    }
    
  },
  //关键字搜索
  keySearch:function(e){
    let key = e.currentTarget.dataset.key
    let geturl = null;
    let songfrom = null;
    if (this.data.songbook) {
      geturl = 'https://api.bzqll.com/music/netease/search';
      songfrom = 'netease'
    } else {
      geturl = 'https://api.bzqll.com/music/tencent/search';
      songfrom = 'tencent'
    }
    this.setData({
      val: key,
      page: 2
    })
    var that=this
    this.setData({
      key:key
    })
    wx.request({
      url: geturl,
      data: {
        key: 579621905,
        s: key,
        type: 'song',
        limit: 20,
        offset: '1'
      },
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res)
        let allMusic = []
        let list = res.data.data
        for (let i = 0; i < list.length; i++) {
          let music = {}
          music.name = list[i].name
          music.author = list[i].singer
          music.url = list[i].url
          music.img = list[i].pic
          music.lrc = list[i].lrc
          music.id = list[i].id
          music.from = songfrom
          allMusic[i] = music
        }
        that.setData({
          isSearch: true,
          allMusic: allMusic,
        })
      }
    })  
  },

  //歌曲搜素列表懒加载
  lazyLoad:function(){
    let val=this.data.val
    let page=this.data.page
    let listNum=this.data.allMusic.length
    // console.log(page)
    // console.log(listNum)
    let geturl = null;
    let songfrom = null;
    if (this.data.songbook) {
      geturl = 'https://api.bzqll.com/music/netease/search';
      songfrom = 'netease'
    } else {
      geturl = 'https://api.bzqll.com/music/tencent/search';
      songfrom = 'tencent'
    }

    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: geturl,
      data: {
        key: 579621905,
        s: val,
        type: 'song',
        limit: 20,
        offset: page
      },
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        let allMusic = that.data.allMusic
        let list = res.data.data
        for (let i = 0; i < list.length; i++) {
          let music = {}
          music.name = list[i].name
          music.author = list[i].singer
          music.url = list[i].url
          music.img = list[i].pic
          music.lrc = list[i].lrc
          music.id = list[i].id
          music.from = songfrom
          allMusic[listNum] = music
          listNum=listNum+1
        }
        if (allMusic.length == that.data.allMusicNum) {
          wx.showToast({
            title: '已加载完毕',
            icon: 'none',
            duration: 2000
          })
        }
        that.setData({
          isSearch: true,
          allMusic: allMusic,
          page:page+1,
          allMusicNum: allMusic.length          
        })
      },
      fail:function(){
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this;
      wx.getStorage({
        key: 'songbook',
        success: function(res) {
          that.setData({
            songbook: res.data
          })
        },
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getHostSearchWord()
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