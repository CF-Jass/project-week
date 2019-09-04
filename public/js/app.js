$(document).ready(function () {
  $('#links').hide()
  $('#sabers').click(function () {
    $('#links').toggle().css({
      'transition': 'transform 0.8s', 'transform': 'translate(50px)', 'z-index': '4'
    });
  })

  $('#sabers').mouseover(function () {
    $('#obi-plasma').css({ 'background': 'rgb(255, 255, 255)', 'box-shadow': '0px 0px 12px 6px #0ff' });
    $('#vader-plasma').css({ 'background': 'rgb(255, 255, 255)', 'box-shadow': '0px 0px 12px 6px rgb(224, 20, 16)' })
    $('#yoda-plasma').css({ 'background': 'rgb(255, 255, 255)', 'box-shadow': '0px 0px 12px 6px rgb(37, 167, 76)' })
  })
  $('#sabers').mouseleave(function () {
    $('#obi-plasma').css({ 'background': 'rgb(255, 255, 255)', 'box-shadow': '0px 0px 12px 3px rgb(233, 235, 235)' });
    $('#vader-plasma').css({ 'background': 'rgb(255, 255, 255)', 'box-shadow': '0px 0px 12px 3px rgb(233, 235, 235)' })
    $('#yoda-plasma').css({ 'background': 'rgb(255, 255, 255)', 'box-shadow': '0px 0px 12px 3px rgb(233, 235, 235)' })
  })


})



// // transition: transform 0.8s;
// // transform: translate(200px);
// }
