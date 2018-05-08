const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      id:1,
      latitude: 29.58015,
      longitude: 105.05844,
      iconPath: '../images/location.png',
      callout:{
        content:"as",

      }
      ,title:"Asd"
      
    }],

    region: ['广东省','','定位中'],
    customItem: '全部',
    allDates:[],
    distance:[]
  },
  onLoad: function (options) {
    let that = this;
    that.getAlldates();
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        console.log(res)
        that.setData({
          distance: { ...res }
        })
        app.util.request({
          'url': 'entry/wxapp/map',
          headers: {
            'Content-Type': 'application/json',
          },
          'cachetime': '0',
          data: { op: op },
          success: res => {
            console.log(res);
            // console.log(res.data.result.ad_info.city + res.data.result.ad_info.adcode);

            that.setData({
              region: [res.data.result.ad_info.province, res.data.result.ad_info.city, res.data.result.ad_info.district],
            })

          }
        })
      }
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },
  
  bindRegionChange:function(res){
   this.setData({
     region:res.detail.value
   })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  getAlldates: function (e) {
    let that = this;
    if (that.data.allDates.length == 0) {
      app.util.request({
        'url': 'entry/wxapp/infos',
        headers: {
          'Content-Type': 'application/json',
        },
        'cachetime': '0',
        data: {
          type: "getAll"
        },
        success: function (res) {

          res.data.map(function (v, k) {
          //  res.data[k].time = that.timestampToTime(v.time);
            let p = "";
            switch (v.types) {
              case "0":
                p = "寻狗启示";
                break;
              case "1":
                p = "寻源主人";
                break;
              case "2":
                p = "待领养狗";
                break;
              case "3":
                p = "待领养猫";
                break;
              case "4":
                p = "其它宠物";
                break;
              case "5":
                p = "我想领养";
                break;
            }
            res.data[k].types = p;
            res.data[k].imgs = JSON.parse(v.imgs.replace(/&quot;/g, '"'));
            let place = JSON.parse(v.location.replace(/&quot;/g, '"'));
            res.data[k].location = place
         //   res.data[k].fdistance = that.getSpace(place.latitude, place.longitude)
         //   res.data[k].address = place.address + that.getDistance(place.latitude, place.longitude);
          })

          res.data = res.data.sort(function (n, b) {
            return n.fdistance - b.fdistance;
          })
          let Lists = res.data.slice(that.data.newIndex, 10);
          that.setData({
            allDates: res.data,
            newIndex: that.data.newIndex + 9,
            list: Lists
          })
        },

      })
    } 
  },
  sousuo: function (e) {
  var that = this;
  if (e.detail.value == '' && that.data.back.length >= 1) {
    that.setData({
      list: that.data.back,
      index: that.data.backIndex
    })
  } else {

    that.setData({
      list: that.data.allDates.filter(function (v, k) {
        let s = new RegExp(e.detail.value);
        return s.test(v.types) || s.test(v.contents);
      }),
  
    })
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