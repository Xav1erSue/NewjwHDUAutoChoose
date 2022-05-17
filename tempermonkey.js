// ==UserScript==
// @name         【2021】杭电新教务系统自动学评教
// @namespace    https://github.com/Xav1erSue/Newjw_HDU_AutoChoose
// @version      2.0
// @description  杭电新教务系统自动学评教
// @author       @Xav1erSue
// @match        http://newjw.hdu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @icon         https://www.google.com/s2/favicons?domain=hdu.edu.cn
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");

  /* 图形化界面正在开发中…… */

  const config = {
    /**
     * 是否开启直接提交
     * 默认为 false
     * 开启后点击开始按钮会直接打分并提交
     */
    startAndSubmit: false,
    /**
     * 选项比例，自动学评教时 A、B、C、D 的分别占比
     * 默认值为 { A: 0.6, B: 0.4, C: 0, D: 0 } ,即 A: 60%, B: 40%, C: 0%, D: 0%
     */
    ratio: {
      A: 0.6,
      B: 0.4,
      C: 0,
      D: 0,
    },
    /**
     * @todo 待定
     * 白名单，单独设置老师的学评教参数
     * （似乎没有什么意义？如果有人希望有这个功能的话我再做吧）
     */
    whiteList: [
      {
        name: "张三",
        radio: {
          A: 0.5,
          B: 0.3,
          C: 0.1,
          D: 0.1,
        },
      },
    ],
    /**
     * 监听时间间隔，用于监听 DOM 节点是否已经挂载
     * 如网络不好可以尝试调大该值
     * 默认值为 200 ms
     *  */
    interval: 200,
  };
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
  document.querySelector("#btn_yd").click();

  const timer = setInterval(() => {
    if (document.querySelector(".ui-pg-selbox")) {
      document.querySelector(".ui-pg-selbox").style.outline = "5px solid red";
      const head = document.querySelector(".navbar-header");
      // 挂载开始评价按钮
      const startBtn = document.createElement("button");
      startBtn.innerText = "点击开始";
      startBtn.addEventListener("click", startAutoChoose);
      head.appendChild(startBtn);
      // 提示展开全部课程
      const notice = document.createElement("span");
      notice.innerText =
        "请将下方显示课程数（红框内）调至可以展示所有课程！初始值为15";
      notice.style.color = "white";
      head.appendChild(notice);
      clearInterval(timer);
    }
  }, config.interval);

  const toggleAll = (id, limit) => {
    document.getElementById(id++).click();
    const timer = setInterval(() => {
      const radios = document.querySelectorAll(".radio-pjf");
      if (radios) {
        for (let i = 0; i < 10; i++) {
          const rand = Math.random();
          if (rand <= config.ratio["A"]) radios[i * 4].checked = true;
          else if (rand <= config.ratio["A"] + config.ratio["B"])
            radios[i * 4 + 1].checked = true;
          else if (
            rand <=
            config.ratio["A"] + config.ratio["B"] + config.ratio["C"]
          )
            radios[i * 4 + 2].checked = true;
          else radios[i * 4 + 3].checked = true;
        }
        clearInterval(timer);
        // 给 button 添加 enter 属性从而绕过脚本限制
        if (config.startAndSubmit)
          $("#btn_xspj_tj").data("enter", "true").click();
        else $("#btn_xspj_bc").data("enter", "true").click();

        const timer2 = setInterval(() => {
          if (document.querySelector("#btn_ok")) {
            clearInterval(timer2);
            document.querySelector("#btn_ok").click();
            if (id <= limit) toggleAll(id, limit);
          }
        }, config.interval);
      }
    }, config.interval);
  };

  const startAutoChoose = () => {
    const confirmed =
      confirm(`您是否已将下方显示课程数（红框内）调至可以展示所有课程
如果未调整会出现无法全部自动评价的情况！
默认的评价比例为 A: 60%, B: 40%, C: 0%, D: 0%
默认的提交方式是直接提交
如果您不希望评价完提交，请到油猴脚本的设置中将 \`startAndSubmit\` 选项设置为 \`false\`
比例同样可以在油猴脚本的配置中进行手动修改
图形化修改界面正在开发，后续会增加更多功能！`);
    if (confirmed) {
      const saved = parseInt(document.querySelector("#bc > span").innerText);
      const notRated = parseInt(document.querySelector("#wp > span").innerText);
      const total = saved + notRated;
      toggleAll(1, total);
    }
  };
})();
