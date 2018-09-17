// pages/index/main/upload/upload.js
const qiniuUploader = require("../../../../utils/qiniuUploader");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    isUpload:false,
    isInput:false,
    val:'',
    progress:0,
    userInfo: {},
    open:null
  },

  //获取视频
  getVideo: function() {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      compressed:true,
      success: function(res) {
        
        that.setData({
          src: res.tempFilePath,
          isUpload:true
        })
      }
    })
  },

  //获取输入的值
  getInputVal:function(e){
    let val = e.detail.value
    if(val){
      this.setData({
        isInput:true,
        val:val
      })
    }else{
      this.setData({
        isInput: false,
      })  
    }
  },

  //发布视频动态
  subVideo:function(){
    var time = (Date.parse(new Date())) / 1000
    let upthis=this

    var filePath = this.data.src;

    if(this.data.isInput){
      if(this.data.isUpload){
        qiniuUploader.upload(filePath, (res) => {
          
          wx.request({
            url: 'https://www.mosillion.top/TestSSM/video/submitVideo',
            data: {
              'username': upthis.data.userInfo.nickName,
              'userImg': upthis.data.userInfo.avatarUrl,
              'video': upthis.data.open + time,
              'videoTitle': upthis.data.val,
              'wxNum': upthis.data.open
            },
            method: 'GET',
            success: function (res) {
              //重置信息
              upthis.setData({
                isUpload: false,
                isInput: false,
                val: '',
                progress: 0
              })
              wx.showToast({
                title: '视频上传成功',
                icon: 'none',
                duration: 2000
              })

            },
            fail: function (res) {
              wx.showToast({
                title: '视频上传失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
          
         


          
        }, (error) => {
          console.log('error: ' + error);
        }, {
            region: 'NCN',
            uploadURL: 'https://up-z1.qbox.me',
            domain: 'pak6mqt97.bkt.clouddn.com',
            shouldUseQiniuFileName: false,
            uptokenURL: 'https://www.mosillion.top/TestSSM/qiniu/getToken',
            key: 'video/' + upthis.data.open + time

          }, (progress) => {
            // console.log('上传进度', progress.progress)
            // console.log('已经上传的数据长度', progress.totalBytesSent)
            // console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)

            upthis.setData({
              progress: progress.progress
            })

          }
        )

      }else{
        wx.showToast({
          title: '请选择上传的视频',
          icon: 'none',
          duration: 2000
        })
      }

    }else{
      wx.showToast({
        title: '写点什么吧...',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userInfo: res.userInfo,
              })
              console.log(res.userInfo)
            }
          })
        }
      }
    })

    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
          open:res.data.openId
        })
      },
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