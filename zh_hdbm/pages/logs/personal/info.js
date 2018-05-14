var app = getApp()
Page({
data:{
  items: [
    { name: '1', value: '男', checked: 'true'},
    { name: '2', value: '女' },
  ],
  sex: 1,
  infos:{
    phone:'',
    info:"",
    openid:"",
    addr:"",
    nickname:""
  }
},
  radioChange:function(e){
  this.setData({
    sex:e.detail.value
  })
  },

formSubmit:function(e){
  let that = this;
 let rdate=e.detail.value;
 console.log(rdate);
  for (let x in rdate){
    if (rdate[x].length==0){
      wx.showModal({
        content: '请填写所有字段',
        showCancel:false
      })
      return false;
    }
  }

  app.util.request({
    'url': 'entry/wxapp/edit',
    headers: {
      'Content-Type': 'application/json',
    },
    'cachetime': '0',
    data: { ...rdate,sex:that.data.sex,openid:that.data.infos.openid},
    success:function(res){

      if(res.data==1){
        wx.setStorageSync("name", rdate.nickname);
        wx.setStorageSync("sex", rdate.sex);
        wx.setStorageSync("phone", rdate.phone)
        wx.setStorageSync("addr", rdate.addr)
        wx.setStorageSync("infos", rdate.info)
        wx.showModal({
          content: '修改成功!',
          showCancel: false,
          success:function(res){
            if(res.confirm){
              wx.switchTab({
                url:"../../index/index",
              })
            }
          }
        })
      }
    }
  })
},
onLoad:function(e){
  this.setData({
    infos:{
      phone: wx.getStorageSync("phone"),
      info: wx.getStorageSync("infos"),
      openid: wx.getStorageSync("openid"),
      addr: wx.getStorageSync("addr"),
      nickname: wx.getStorageSync("name")
    }
  })

}

})
