//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //是否授权
  bindGetUserInfo: function (e) {

    if (e.detail.userInfo) {
      wx.redirectTo({
        url: 'main/main',
      })
    } else {
      wx.showToast({
        title: '没有授权无法访问',
        duration: 700
      })
    }
  },


  //事件处理函数
  onLoad: function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.startRecord()
            }
          })
        }else{
          wx.redirectTo({
            url: 'main/main',
          })
        }
      }
    })

    wx.getStorage({
      key: 'music',
      success: function(res) {},
      fail:function(res){
        let music = {
          name: '地球ぎ',
          url: 'https://v1.itooi.cn/netease/url?id=614150',
          author: '松澤由美',
          img: 'http://p2.music.126.net/VevkzzcBfdZGHKQFHsf0Wg==/920291232448667.jpg',
          lrc:'https://v1.itooi.cn/netease/lrc?id=614150'
        }
        wx.setStorage({
          key: 'music',
          data: JSON.stringify(music),
        })
      }
    })
    
    wx.getStorage({
      key: 'music',
      success: function (res) {},
      fail: function (res) {
        wx.setStorage({
          key: 'playlist',
          data: JSON.stringify([]),
        })
      }
    })
    
    wx.getStorage({
      key: 'playStyle',
      success: function(res) {},
      fail: function (res) {
        console.log("xxx")
        wx.setStorage({
          key: 'playStyle',
          data: 0,
        })
      }
    })

    wx.getStorage({
      key: 'songbook',
      success: function (res) { },
      fail: function (res) {
        console.log("xxx")
        wx.setStorage({
          key: 'songbook',
          data: 0,
        })
      }
    })

    
    
    
  },
  // getUserInfo: function(e) {
    
  // },

})
