$( document ).ready(function() {
  var width = $('.container').width();
  var height = window.innerHeight;

  var measureLength = 4;
  var fourFour = [{x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}];
  
  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height * 0.8
  });

  var layer = new Konva.Layer();

  console.log(stage.getWidth());
  console.log(stage.getHeight());

  var circle = new Konva.Circle({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: 60,
    fill: 'red',
  });

  // add the shape to the layer
  layer.add(circle);

  // add the layer to the stage
  stage.add(layer);

  // Select all range inputs, watch for change
  $("input[type='range']").on('input', function() {
    // Cache this for efficiency
    el = $(this);
    // Move bubble
    el
     $("#tempoBpm")
     .text(el.val());
   })
   // Fake a input to position bubble at page load
   .trigger('input');

  var maxAmplitude = 200;
  var amplitudeX = Math.min(stage.getWidth() * 0.4, maxAmplitude);
  var amplitudeY = Math.min(stage.getHeight() * 0.4, maxAmplitude);
  var amplitude = Math.min(amplitudeX, amplitudeY);
  var centerX = stage.getWidth() / 2;
  var centerY = stage.getHeight() / 2;

  var pt0, pt1;
  var prevTime = 0;
  var animPct = 0.0;
  var anim = new Konva.Animation(function(frame) {
      var period = 60000 / $("#tempo").val() * measureLength;

      animPct += ((frame.time - prevTime) / period);
      if (animPct > 1)
        animPct -= 1;
      prevTime = frame.time;

      pt0 = Math.floor(animPct * measureLength) % measureLength;
      pt1 = Math.floor(animPct * measureLength + 1) % measureLength;
      var progress = animPct * measureLength - pt0;

      if (progress <= 0.2)
        circle.fill('orange');
      else
        circle.fill('red');
      circle.setX(
        (fourFour[pt0].x * amplitude * (1-progress)) +
        (fourFour[pt1].x * amplitude * progress) +
        + centerX);
      circle.setY(
        (fourFour[pt0].y * amplitude * (1-progress)) +
        (fourFour[pt1].y * amplitude * progress) +
        + centerY);
  }, layer);

  $('#btnStartStop').click(function() {
    if(anim.isRunning()) {
      anim.stop();
      $('#btnStartStop').html('start');
    } else {
      anim.start();
      $('#btnStartStop').html('stop');
    }
  });
});
