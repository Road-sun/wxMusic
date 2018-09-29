// pages/index/main/myvideo/myvideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: null,
    imgLazy: [true, true],
    video: [],
    userInfo: {},
  },

  //播放视频
  toVideo: function (e) {
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
      url: '../video/video?video=' + value,
    })
  },

  //图片懒加载
  getScroll: function (res) {
    let that = this
    // console.log(res)
    // console.log(res.detail.scrollTop);
    let count = parseInt(res.detail.scrollTop / 260);
    // console.log(count);
    that.data.imgLazy[count + 2] = true;
    that.setData({
      imgLazy: that.data.imgLazy
    })

  },


  //获取所有视频
  getAllVideo: function () {
    var that = this
    wx.request({
      url: 'https://www.mosillion.top/TestSSM/video/getPerVideo',
      data:{
        wxNum:that.data.open
      },
      success: function (res) {
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
  giveLike: function (e) {
    let id = e.target.dataset.id
    let videoList = this.data.video
    let lg = this.data.video.length
    let ass = 0
    if (videoList[lg - id].islike == 1) {
      ass = 0
      videoList[lg - id].islike = 0
      --videoList[lg - id].good
    } else {
      ass = 1
      videoList[lg - id].islike = 1
      ++videoList[lg - id].good
    }
    this.setData({
      video: videoList
    })

    wx.request({
      url: 'https://www.mosillion.top/TestSSM/comment/giveLike',
      data: {
        id: id + '',
        username: this.data.userInfo.nickName,
        userImg: this.data.userInfo.avatarUrl,
        islike: ass,
        wxNum: this.data.open,
      },
      success: function () {
        // console.log("dianzanle")
      }
    })
  },

  //获取点赞状态
  getIsLike: function () {
    var that = this
    wx.request({
      url: 'https://www.mosillion.top/TestSSM/comment/findIsLike',
      data: {
        wxNum: this.data.open,
      },
      success: function (res) {
        // console.log(res.data)
        let newVideoList = that.data.video
        // console.log(newVideoList)
        let lg = that.data.video.length
        
        for (var i = 0; i < res.data.length; i++) {
          let id = parseInt(res.data[i].videoId)
          let islike = parseInt(res.data[i].isLike)
          for(var j=0;j<lg;j++){
            if(newVideoList[j].id==id){
              newVideoList[j].islike=islike
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




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              that.setData({
                userInfo: res.userInfo,
              })
              // console.log(res)
            }
          })
        }
      }
    })


    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          open: res.data.openId
        })
        //获取视频列表
        that.getAllVideo();
      },
    })

   


    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})