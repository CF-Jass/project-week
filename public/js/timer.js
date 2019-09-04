

function checkStorage() {
  let timeRemaining = 300000;
  if (!localStorage.timer){
    testTimer(timeRemaining)
  } else {
    let storedTime = localStorage.getItem('timer')
    let parseTime = JSON.parse(storedTime)
    testTimer(parseTime)
  }
}

function testTimer(timeRemaining) {
  let countDownDate = new Date(Date.now() + timeRemaining).getTime();
  var x = setInterval(function() {
    timeRemaining = timeRemaining - 1000;
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var timer = new Timer(300,(timeRemaining/1000), 1000, () => {
      clearInterval(x);
      window.location.pathname = '/scores';
      localStorage.clear();
    })
    timer.resume();
    localStorage.setItem("timer",timeRemaining);
  }, 1000);
}



function Timer (start, count_from, interval, on_zero){
  this.count_from = start;
  this.current = count_from;
  this.running = false;
  this.on_zero = on_zero;
  this.timer_element = $('.timer_blade_actual').first();
  this.outline_width = $('.timer_blade_outline').first().width();
  this.actual_timer = setInterval(() => {
    if (!this.running || this.current < 0) {
      this.running = false;
      return;
    }
    this.current--;
    let percentage = this.current / this.count_from;
    this.timer_element.width(this.outline_width * percentage);

    if (this.current < 0) {
      this.running = false;
      if (this.on_zero) {
        this.on_zero();
      }
    }
  }, interval);
}


Timer.prototype.pause = function () {
  this.running = false;
}

Timer.prototype.resume = function () {
  this.running = true;
}

// Move these two lines to whichever page is using our timer
// var timer = new Timer(60, 1000, () => window.location.pathname = '/timer_zero');

checkStorage()


