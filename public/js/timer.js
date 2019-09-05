function Timer(count_from, interval, name, on_zero) {
  this.name = name;
  this.count_from = count_from;
  this.current = count_from;
  const previousCount = localStorage.getItem(name); 
  if (previousCount !== null && previousCount !== undefined && previousCount >= 0) {
    this.current = previousCount; 
  }

  this.running = true;
  this.on_zero = on_zero;
  this.timer_element_el = $('.timer_blade_actual').get(0);
  this.outline_width = $('.timer_blade_outline').first().width();
  const timer_event = () => {
    if (!this.running || this.current < 0) {
      this.running = false;
      return;
    }
    this.current--;
    localStorage.setItem(name, this.current);
    let percentage = this.current / this.count_from;
    this.timer_element_el.style.width = (this.outline_width * percentage) + "px";
    if (percentage < 1) {
      this.timer_element_el.style.transition = "width 1s";
    }
    if (this.current < 0) {
      this.running = false;
      // Reset the stored named timer so we can recount
      if (this.on_zero) {
        this.on_zero();
      }
    }
  }
  
  this.actual_timer = setInterval(() => timer_event(), interval);
  timer_event();
}


Timer.prototype.pause = function () {
  this.running = false;
}

Timer.prototype.resume = function () {
  this.running = true;
}

var timer = new Timer(300, 1000, 'trivia_timer', () => {
  window.location.pathname = '/scores';
})