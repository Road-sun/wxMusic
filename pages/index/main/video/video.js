// pages/index/main/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
<<<<<<< Updated upstream
      video:{},
      comment:{},
      value:null,
      userInfo: {},
      open: null,
      currentTime:0,
      danmuList: []
=======
    video: {},
    comment: {},
    value: null,
    userInfo: {},
    open: null,
    currentTime: 0,
    danmuList: [],
    videoTime:0

>>>>>>> Stashed changes
  },


  //获取视频进度
  getCurrentTime: function(e) {
    let sTime = e.detail.currentTime
    this.setData({
      currentTime: sTime
    })
  },

  //评论时视频的进度
  getVideoTime:function(){
      let sTime =this.data.currentTime
      console.log(sTime)
      this.setData({
        videoTime:sTime
      })
  },

  //获取输入的值
  getInputVal: function(e) {
    let val = e.detail.value
    this.setData({
      value: val
    })
  },

  //提交评论
  subComment: function() {
    var that = this;
    if (this.data.value) {
      wx.request({
        url: 'https://www.mosillion.top/TestSSM/comment/submitCommment',
        data: {
          id: this.data.video.id,
          username: this.data.userInfo.nickName,
          userImg: this.data.userInfo.avatarUrl,
          content: this.data.value,
          wxNum: this.data.open,
          currentTime: this.data.videoTime
        },
        success: function(res) {
          wx.showToast({
            title: '发表成功',
            icon: 'none',
            duration: 2000
          })

          let comment = {
            username: that.data.userInfo.nickName,
            userImg: that.data.userInfo.avatarUrl,
            subTime: new Date(),
            content: that.data.value
          }
          let newCommetList = that.data.comment
          newCommetList.unshift(comment)

          let newVideo=that.data.video

          newVideo.commentNum = parseInt(that.data.video.commentNum) +1

          that.setData({
            value: '',
            comment: newCommetList,
            video:newVideo
          })
        }
      })

    } else {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //获取评论
  getComment: function(id) {
    let commentList = [];
    let danmuList = [];
    let that = this
    wx.request({
      url: 'https://www.mosillion.top/TestSSM/comment/getComment',
      data: {
        id: id
      },
      success: function(res) {
        for (let i = res.data.length - 1, j = 0; i >= 0; --i, ++j) {
          let content = res.data[i]

          let comment = {}
          comment.username = content.username
          comment.subTime = content.commentTime
          comment.userImg = content.userImg
          comment.content = content.commentContent
          commentList[j] = comment

          let danmu = {}
          danmu.text = content.commentContent
          danmu.time = parseInt(content.curTime)
          danmuList[j] = danmu
        }
        that.setData({
          comment: commentList,
          danmuList: danmuList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var vname = JSON.parse(e.video)
    // console.log(vname)
    this.setData({
      video: vname
    })

    let that = this
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                userInfo: res.userInfo,
              })
              // console.log(res.userInfo)
            }
          })
        }
      }
    })

    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
          open: res.data.openId
        })
      },
    })

    this.getComment(vname.id)
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