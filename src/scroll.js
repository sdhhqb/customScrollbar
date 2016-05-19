(function () {

  function CustomScroll (id) {
    this.id = id;
    this.content = document.getElementById(id);
    this.outter = content.parentNode;
    this.scrollContaner = document.createElement('div');
    this.scrollBar = document.createElement('div');

    this.sequence = 0;
    // 方向 1 向下 -1 向上
    this.direct = 0;
    // 最大速度比率
    this.maxratio = 2;
    this.dt = 100;
    // 速度比率
    this.ratio = 1;
    this.containerHeight = this.outter.clientHeight;
    this.barHeight = 0;
    this.barTop = 0;
    this.curTop = 0;
    this.animating = false;
  }

  var csProto = CustomScroll.prototype;

  csProto.init = function () {
    var scrollContaner = this.scrollContaner;
    scrollContaner.style.cssText = 'width:'+(this.outter.clientWidth + 30) + 'px;position:absolute;'+
      'top:0;'
    scrollContaner.className = 'scroll-container';
    this.content.style.width = this.outter.clientWidth+'px';
    scrollContaner.appendChild(this.content);
    this.outter.appendChild(scrollContaner);

    var scrollBar = this.scrollBar;
    this.barHeight = this.outter.clientHeight * this.outter.clientHeight / this.content.clientHeight;
    scrollBar.style.cssText = 'width:5px;height:'+this.barHeight+'px;background:#999;position:absolute;top:0;'+
      'left:'+(this.outter.clientWidth - 5)+'px;';
    scrollBar.className = 'scroll-bar'

    this.outter.appendChild(scrollBar);

    var _this = this;

    window.addEventListener('wheel', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = e.target, count = 0;
      var curScroll = null;
      while (parent != document.documentElement && count < 100) {
        parent = parent.parentNode;
        count += 1;
        if (parent == scrollContaner) {
          curScroll = parent;
          break;
        }
      }
      if (curScroll) {
        if (_this.sequence) {
          if (e.deltaY > 0) {
            // _this.ratio = _this.direct > 0 ? _this.ratio + 0.2 : 1;
            _this.direct = 1;
          } else if (e.deltaY < 0) {
            // _this.ratio = _this.direct < 0 ? _this.ratio + 0.2 : 1;
            _this.direct = -1;
          }
        }          
        _this.sequence = 1;
        setTimeout(function () {
          _this.sequence = 0;
        }, 300);

        _this.ratio = _this.ratio > _this.maxratio ? _this.maxratio : _this.ratio;
        _this.ratio = 1;
        var newTop;
        if (e.deltaY > 0) {
          _this.curTop = _this.curTop - _this.dt*_this.ratio;
        } else {
          _this.curTop = _this.curTop + _this.dt*_this.ratio;
        }
        _this.curTop = _this.curTop > 0 ? 0 : _this.curTop;
        _this.curTop = _this.curTop + _this.content.clientHeight < _this.outter.clientHeight ? _this.outter.clientHeight - _this.content.clientHeight : _this.curTop;
        newTop = _this.curTop;
        // if (!animating) {
          // animating = true;
          // setTimeout(function () {
          //   animating = false;
          // }, 500);
          scrollContaner.style.top = newTop+'px';
          _this.barTop = (-newTop * _this.outter.clientHeight / _this.content.clientHeight);
          scrollBar.style.top = _this.barTop+'px';
        // }
      }
    });

    scrollContaner.addEventListener("mousedown", function (e) {
      console.log(e);
      e.preventDefault();
      e.stopPropagation();
    })
  }

  if (!window.CustomScroll) {
    window.CustomScroll = CustomScroll;
  }

})();