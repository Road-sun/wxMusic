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
    page: 1,
    allMusicNum:null,
    songbook:null,
    playlist: [],
    songkind:['QQ音乐','网易云音乐','酷狗音乐','酷我音乐','咪咕音乐','百度音乐']
  },

//改变曲库
  songChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      songbook:  parseInt(e.detail.value)
    })
    wx.setStorage({
        key: 'songbook',
        data: parseInt(e.detail.value),
      })
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

  //更多设置（弹出底部框体）
  moreSetting: function (e) {
    let that = this
    let id = e.currentTarget.dataset.mid
    let music = this.data.allMusic[id]
    wx.showActionSheet({
      itemList: ['加入播放列表', '下载', '待开发'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.getList(music);
        }
        if(res.tapIndex==1){
          wx.downloadFile({
            url: music.url, // 仅为示例，并非真实的资源
            filePath:'C:\\Users\\lly\\Desktop',
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              console.log(res)
              if (res.statusCode === 200) {
                console.log(res.tempFilePath)
                // wx.saveFile({
                //   tempFilePath: res.tempFilePath,
                //   success(res1) {
                //     console.log(res1.savedFilePath)
                //   },
                //   fail:function(err){
                //     console.log(err)
                //   }
                // })
              }
            },
            fail:function(err){
                console.log(err);
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
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
    if(this.data.songbook==1){
      geturl ='https://v1.itooi.cn/netease/search';
      songfrom ='netease'
    } 
    if (this.data.songbook == 0){
      geturl = 'https://v1.itooi.cn/tencent/search';
      songfrom = 'tencent'
    }
    if (this.data.songbook == 2){
      geturl = 'https://v1.itooi.cn/kugou/search';
      songfrom = 'kugou'
    }
    if (this.data.songbook == 3) {
      geturl = 'https://v1.itooi.cn/kuwo/search';
      songfrom = 'kuwo'
    }
    if (this.data.songbook == 4) {
      geturl = 'https://v1.itooi.cn/migu/search';
      songfrom = 'migu'
    }
    if (this.data.songbook == 5) {
      geturl = 'https://v1.itooi.cn/baidu/search';
      songfrom = 'baidu'
    }
    this.setData({
      val:val,
      page:1
    })
    var that=this
    if(val){
      wx.request({
        url: geturl,
        data: {
          keyword: val,
          type: 'song',
          pageSize: 20,
          page: 0,
          format: 1
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
    if (this.data.songbook == 1) {
      geturl = 'https://v1.itooi.cn/netease/search';
      songfrom = 'netease'
    }
    if (this.data.songbook == 0) {
      geturl = 'https://v1.itooi.cn/tencent/search';
      songfrom = 'tencent'
    }
    if (this.data.songbook == 2) {
      geturl = 'https://v1.itooi.cn/kugou/search';
      songfrom = 'kugou'
    }
    if (this.data.songbook == 3) {
      geturl = 'https://v1.itooi.cn/kuwo/search';
      songfrom = 'kuwo'
    }
    if (this.data.songbook == 4) {
      geturl = 'https://v1.itooi.cn/migu/search';
      songfrom = 'migu'
    }
    if (this.data.songbook == 5) {
      geturl = 'https://v1.itooi.cn/baidu/search';
      songfrom = 'baidu'
    }
    this.setData({
      val: key,
      page: 1
    })
    var that=this
    this.setData({
      key:key
    })
    wx.request({
      url: geturl,
      data: {
        keyword: key,
        type: 'song',
        pageSize: 20,
        page: 0,
        format: 1
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
    if (this.data.songbook == 1) {
      geturl = 'https://v1.itooi.cn/netease/search';
      songfrom = 'netease'
    }
    if (this.data.songbook == 0) {
      geturl = 'https://v1.itooi.cn/tencent/search';
      songfrom = 'tencent'
    }
    if (this.data.songbook == 2) {
      geturl = 'https://v1.itooi.cn/kugou/search';
      songfrom = 'kugou'
    }
    if (this.data.songbook == 3) {
      geturl = 'https://v1.itooi.cn/kuwo/search';
      songfrom = 'kuwo'
    }
    if (this.data.songbook == 4) {
      geturl = 'https://v1.itooi.cn/migu/search';
      songfrom = 'migu'
    }
    if (this.data.songbook == 5) {
      geturl = 'https://v1.itooi.cn/baidu/search';
      songfrom = 'baidu'
    }
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: geturl,
      data: {
        keyword: val,
        type: 'song',
        pageSize: 20,
        page: page,
        format: 1
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