// ==UserScript==
// @name         【2021】杭电新教务系统自动学评教
// @namespace    https://github.com/Xav1erSue/Newjw_HDU_AutoChoose
// @version      1.0
// @description  杭电新教务系统自动学评教
// @author       @Xav1erSue
// @match        http://newjw.hdu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @icon         https://www.google.com/s2/favicons?domain=hdu.edu.cn  
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");
  // 跳过直接进入主页
  $("#btn_yd")
    .prop("disabled", false)
    .addClass("btn-primary")
    .unbind()
    .click(function () {
      $(document).data("offDetails", "1");
      onClickMenu.call(
        this,
        "/xspjgl/xspj_cxXspjIndex.html?doType=details",
        "N401605",
        { offDetails: "1" }
      );
    });
  document.getElementById("btn_yd").click();

  // var submit = document.getElementById("btn_xspj_tj");
  // 为确保不出意外请手动点击提交

  // 挂载开始按钮
  var head = document.getElementsByClassName("navbar-header")[0];
  var btn = document.createElement("button");
  btn.innerText = "点击开始";
  btn.addEventListener("click", autoChoose);
  head.appendChild(btn);
  // 提示展开全部课程
  var notice = document.createElement("span");
  notice.innerText = "请将左侧显示课程数调至可以展示所有课程！初始值为15";
  notice.style.color = "white";
  head.appendChild(notice);
  // 单个教师提交
  function toggleAll() {
    var radios = document.getElementsByClassName("radio-pjf");
    for (var i = 0; i < 10; i++) {
      if (Math.random() >= 0.4) radios[i * 4].checked = true;
      else radios[i * 4 + 1].checked = true;
    }
    document.getElementById("btn_xspj_bc").click();
    document.getElementById("btn_ok").click();
  }

  // 遍历全部学评教
  function autoChoose() {
    // 获取全部可评价课程
    var saved = parseInt(document.getElementById("bc").children[0].innerText);
    var lefted = parseInt(document.getElementById("wp").children[0].innerText);
    var total = saved + lefted;
    // 从第一门开始
    document.getElementById(1).click();
    // 使用计时器循环
    var i = 1;
    var timer = setInterval(function () {
      var cur = document.getElementById(i);
      if (i >= total) clearInterval(timer);
      if (cur.children[7].title == "未评") {
        toggleAll();
      }
      // 最后再切换视图，留出一秒加载时间
      i++;
      document.getElementById(i).click();
    }, 1000);
  }
})();
