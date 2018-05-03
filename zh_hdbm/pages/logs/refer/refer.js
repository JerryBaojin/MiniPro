// zh_hdbm/pages/refer/refer.js
var siteinfo = require('../../../../siteinfo.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(that.data)
    that.setData({
      uniacid: siteinfo.uniacid
    })
    var user_id = wx.getStorageSync('uid');
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var url = res.data
        that.setData({
          url: url
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var http = res.data.slice(0,5)
        console.log(http)
        if(http!='https'){
          wx:wx.showModal({
            title: '提示',
            content: '您的网址不是https，请检查后台配置是否正确',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        var url = res.data
        that.setData({
          urll: url,
          http: http
        })
      },
    })
    // 判断用户是否完善资料
    app.util.request({
      'url': 'entry/wxapp/checkdata',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
         fabu:res.data
        })
        // 直接发布活动
        if(res.data==1){
          app.util.request({
            'url': 'entry/wxapp/attachurl',
            'cachetime': '0',
            success: function (res) {
              console.log(res)
              var url = res.data
              that.setData({
                url: url
              })
              app.util.request({
                'url': 'entry/wxapp/getdata',
                'cachetime': '0',
                data: { user_id: user_id },
                success: function (res) {
                  console.log(res)
                  that.setData({
                    text: res.data.name,
                    logo: res.data.logo,
                    tel: res.data.details,
                    phone: res.data.tel,
                    id:res.data.id
                  })
                },
              })
            },
          })
          // 获取主办方资料
         
        }else{
          that.setData({
            text: '',
            logo: '',
            tel: '',
            phone: ''
          })
        }
      },
    })
    // wx: wx.navigateBack({
    //   url: 'activity',
    // })
    console.log(user_id)
    
  },
  // 点击选择图片
  choose: function (e) {
    var that = this
    var uniacid = that.data.uniacid
    var urll = that.data.urll
    console.log(urll)
    console.log(uniacid)
    var http = that.data.http
    if (http != 'https') {
      wx: wx.showToast({
        title: '网址配置不正确',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res)
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths[0]
          console.log(tempFilePaths)
          wx.uploadFile({
            url: urll + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_hdbm',
            filePath: tempFilePaths,
            name: 'upfile',
            formData: {},
            success: function (res) {
              console.log(res)
              // function trimLeft(s) {
              //   if (s == null) {
              //     return "";
              //   }
              //   var whitespace = new String(" \t\n\r");
              //   var str = new String(s);
              //   if (whitespace.indexOf(str.charAt(0)) != -1) {
              //     var j = 0, i = str.length;
              //     while (j < i && whitespace.indexOf(str.charAt(j)) != -1) {
              //       j++;
              //     }
              //     str = str.substring(j, i);
              //   }
              //   return str;
              // }  
              that.setData({
                uplogo: res.data,
                logo: res.data
              })
            },
            fail: function (res) {
              console.log('上传失败')
              console.log(res)
            },
          })
        }
      })
    }
    
  },
  jianjie:function(e){
    var tel = this.data.tel
      wx:wx.navigateTo({
        url: '../intro/intro?tel=' + tel,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
  },
  
  formSubmit:function(e){
    var that = this
    var user_id = wx.getStorageSync('uid');
    console.log(user_id)
    console.log(that.data)
    var fabu = that.data.fabu
    var id = that.data.id
    var text = that.data.text
    var logo = that.data.logo
    var uplogo = that.data.uplogo
    console.log(uplogo)
    // if (that.data.uplogo==null){
    //   var logo = that.data.logo
    // }else{
    //   var logo = that.data.uplogo
    // }
    var tel = that.data.tel
    var text = e.detail.value.text
    var phone = e.detail.value.phone
    console.log('图片' +logo)
    console.log('名称' + text)
    console.log('简介' + tel)
    console.log('电话' + phone)
    if (text == null || text==''){
      wx:wx.showToast({
        title: '请输入名称',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (logo == null || logo == ''){
      wx: wx.showToast({
        title: '请上传图片',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (tel == null || tel == '') {
      wx: wx.showToast({
        title: '请输入活动简介',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (phone == null || phone == '') {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (phone.length != 11) {
      wx: wx.showToast({
        title: '手机号错误',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else{
      if(fabu==1){
        app.util.request({
          'url': 'entry/wxapp/savedata',
          'cachetime': '0',
          data: {
            user_id: user_id,
            name: text,
            logo: uplogo,
            details: tel,
            tel: phone,
            id:id
          },
          success: function (res) {
            console.log(res)
            if(res.data==1){
              wx: wx.showToast({
                title: '修改成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) {
                  wx: wx.reLaunch({
                    url: '../../logs/personal',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
           
          },
        })
      }else{
        console.log(fabu)
        if (uplogo == null || uplogo==''){
          wx:wx.showToast({
            title: '',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }else{
          app.util.request({
            'url': 'entry/wxapp/savedata/personal',
            'cachetime': '0',
            data: {
              user_id: user_id,
              name: text,
              logo: uplogo,
              details: tel,
              tel: phone
            },
            success: function (res) {
              console.log(res)
              wx: wx.showToast({
                title: '发布成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) {
                  wx: wx.reLaunch({
                    url: '../../logs/personal/personal',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            },
          })
        }
        
      }
     
    }
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