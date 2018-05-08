const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagActiveNumber:0,
    imgs:["../images/location.png","../images/master.png"],
    markers: [{
      id:1,
      latitude: 29.58015,
      longitude: 105.05844,
      iconPath: '../images/location.png',
    }],
    controls: [{
      id: 1,
      iconPath: '../images/dw.png',
      position: {
        left: 0,
        top: 300,
        width: 50,
        height: 50
      },
      clickable: true
    },{
      id: 2,
      iconPath: '../images/fresh.png',
      position: {
        left: 0,
        top: 400,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    allDates:[],
    distance:[]
  },
  onReady: function (e) {
  this.mapCtx = wx.createMapContext('myMap')
},
chooseItems:function(e){

    this.setData({
      tagActiveNumber: e.currentTarget.dataset.current
    })

    this.getAlldates();

},
  ctap:function(e){
      e.controlId==1?this.mapCtx.moveToLocation():this.getAlldates();
    },
  tap:function(d){
    let datas=this.data.allDates.find((v)=>{
      return v.id==d.markerId
    })

    wx.setStorageSync("details", datas);
    wx.navigateTo({
      url: "../info/info",
    })
  },
  onLoad: function (options) {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
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
      },complete:function(res){
          that.getAlldates();
      }
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
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
            res.data[k].time = that.timestampToTime(v.time);
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
            res.data[k].typess = v.types;
            res.data[k].types = p;
            res.data[k].imgs = JSON.parse(v.imgs.replace(/&quot;/g, '"'));
            let place = JSON.parse(v.location.replace(/&quot;/g, '"'));
            res.data[k].location = place
            res.data[k].fdistance = that.getSpace(place.latitude, place.longitude)
            res.data[k].address = place.address + that.getDistance(place.latitude, place.longitude);
          })

          res.data = res.data.filter(function (v) {
            return  v.fdistance<=5000
          })

            let prepareDates=new Array();
          let showDatas=res.data.filter((v)=>{
            if(that.data.tagActiveNumber==0){
              return v.typess!=1
            }else{
              return v.typess==1
            }
          })
          //组装
          showDatas.map((v,k)=>{
              prepareDates.push({
                id:v.id,
                latitude: v.location.latitude,
                longitude:v.location.longitude,
                iconPath: that.data.imgs[that.data.tagActiveNumber]
              })
          })

          that.setData({
            allDates: res.data,
            markers:prepareDates
          })
        },

      })
    }else{
      let prepareDates=new Array();
      let showDatas=that.data.allDates.filter((v)=>{
        if(that.data.tagActiveNumber==0){
          return v.typess!=1
        }else{
          return v.typess==1
        }
      })
      //组装
      showDatas.map((v,k)=>{
          prepareDates.push({
            id:v.id,
            latitude: v.location.latitude,
            longitude:v.location.longitude,
            iconPath: that.data.imgs[that.data.tagActiveNumber]
          })
      })
      that.setData({
        markers:prepareDates
      })

    }
  },

timestampToTime: function(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
},
getSpace: function ( lat2, lng2) {
  let res = this.data.distance

  let lat1 = res.latitude || 0;
  let lng1 = res.longitude || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;
  var rad1 = lat1 * Math.PI / 180.0;
  var rad2 = lat2 * Math.PI / 180.0;
  var a = rad1 - rad2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var r = 6378137;
  let p = (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)
  return p;
},
getDistance: function ( lat2, lng2) {
  let res = this.data.distance

  let lat1 = res.latitude || 0;
  let lng1 = res.longitude || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;
  var rad1 = lat1 * Math.PI / 180.0;
  var rad2 = lat2 * Math.PI / 180.0;
  var a = rad1 - rad2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var r = 6378137;
  let p = (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)
  let n = (p / 1000).toFixed(2);

  if (n > 0) {
    return "(" + n + "km" + ")";
  } else {
    return "(" + n + "m" + ")";
  }

},

  onShareAppMessage: function () {

  }
})
