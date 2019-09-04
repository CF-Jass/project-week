
var bubbleOffsetXEnd = 180;
var bubbleOffsetXStart = 80;
var yodaBubble = document.getElementById('yodaTextBubble');

function yodaSays(text, duration, onfinish) {
  showBubble(text, yodaBubble, -1, duration, onfinish);
}

function showBubble(text, bubble, direction, duration, onfinish) {
  // Set text and start animation to make it look like they're talking
  bubble.children[0].innerHTML = text;
  bubble.style.opacity = 1;
  bubble.style.left = (bubbleOffsetXEnd * direction)+"px";
  
  // After the duratrion make the box invisiable
  setTimeout(function() {
    bubble.style.opacity = 0;

    // After the box is invisible slide it back to the original location
    setTimeout(function() {
      bubble.children[0].innerHTML = "";
      bubble.style.left = (bubbleOffsetXStart * direction)+"px";
      setTimeout(onfinish, 1000);
    }, 500)
  }, duration)
}

var yodaText1 = ['When nine hundred years old you reach, look as good you will not.', 4000];
var yodaText2 = ['Do. Or do not. There is no try.', 4000];
var yodaText3 = ['So certain were you. Go back and closer you must look.', 4000];
var yodaText4 = ['When you look at the dark side, careful you must be. For the dark side looks back.', 4000];
var yodaText5 = ['If no mistake have you made, yet losing you are… a different game you should play.', 4000];
var yodaText6 = ['Patience you must have, my young padawan.', 4000];


function doScript() {
  yodaSays(yodaText1[0], yodaText1[1], function() {
    yodaSays(yodaText2[0], yodaText2[1], function() {
      yodaSays(yodaText3[0], yodaText3[1], function() {
        yodaSays(yodaText4[0], yodaText4[1], function() {
          yodaSays(yodaText5[0], yodaText5[1], function() {
            yodaSays(yodaText6[0], yodaText6[1], function() {
            });
          });
        });
      });
    });
  });
}

setTimeout(doScript, 2000);