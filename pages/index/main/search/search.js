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
    allMusicNum:null
  },

  getHostSearchWord:function(){
    var that=this
      wx.request({
        url: 'https://www.mosillion.top/TestSSM/hostSearch/getHostWord',
        success:function(res){
          console.log(res.data)
          let host=res.data.host
          if(host!=[]){
            that.setData({
              reconmmend: host
            })
          }   
        }
      })
  },

  formatterDateTime:function() {
    var date = new Date()
    var month = date.getMonth() + 1
        var datetime = date.getFullYear()
      + ""// "年"
      + (month >= 10 ? month : "0" + month)
      + ""// "月"
      + (date.getDate() < 10 ? "0" + date.getDate() : date
        .getDate())
      + ""
      + (date.getHours() < 10 ? "0" + date.getHours() : date
        .getHours())
      + ""
      + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
        .getMinutes())
      + ""
      + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
        .getSeconds());
    return datetime;
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
    backgroundAudioManager.coverImgUr = 'http://imgcache.qq.com/music/photo/album_300/' + music.img % 100 + '/300_albumpic_' + music.img + '_0.jpg'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/C100' + music.url + '.m4a?fromtag=0&guid=126548448'
    
    wx.setStorage({
      key: "music",
      data: valmusic
    })

    wx.request({
      url: 'https://www.mosillion.top/TestSSM/hostSearch/addHostWord',
      data:{
        value:music.name
      },
      success: function (res) {

      }
    })

  },

  //搜索
  search:function(e){
    let val = e.detail.value
    this.setData({
      val:val,
      page:2
    })
    var that=this
    if(val){
      wx.request({
        url: 'https://route.showapi.com/213-1',
        data: {
          "showapi_timestamp":that.formatterDateTime(), 
          "showapi_appid": 74206,
          "showapi_sign":'3156c98034d946229d61c187c32b4102',
          "keyword": val,
          "page": '1'
        },
        method:'GET',
        dataType:'json',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // console.log(res)
          let allMusic = []
          let list = res.data.showapi_res_body.pagebean.contentlist
          for (let i = 0; i < list.length; i++) {
            let music = {}
            music.name = list[i].songname
            music.author = list[i].singername
            music.url = list[i].songmid
            music.img = list[i].albumid
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
    this.setData({
      val: key,
      page: 2
    })
    var that=this
    this.setData({
      key:key
    })
    wx.request({
      url: 'https://route.showapi.com/213-1',
      data: {
        "showapi_timestamp": that.formatterDateTime(),
        "showapi_appid": 74206,
        "showapi_sign": '3156c98034d946229d61c187c32b4102',
        "keyword": key,
        "page": '1'
      },
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        let allMusic = []
        console.log(res)
        let list = res.data.showapi_res_body.pagebean.contentlist
        for (let i = 0; i < list.length; i++) {
          let music = {}
          music.name = list[i].songname
          music.author = list[i].singername
          music.url = list[i].songmid
          music.img = list[i].albumid
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
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://route.showapi.com/213-1',
      data: {
        "showapi_timestamp": that.formatterDateTime(),
        "showapi_appid": 74206,
        "showapi_sign": '3156c98034d946229d61c187c32b4102',
        "keyword": val,
        "page": page
      },
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        let allMusic = that.data.allMusic
        let list = res.data.showapi_res_body.pagebean.contentlist
        for (let i = 0; i < list.length; i++) {
          let music = {}
          music.name = list[i].songname
          music.author = list[i].singername
          music.url = list[i].songmid
          music.img = list[i].albumid
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