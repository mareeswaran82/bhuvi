$(function () {

  /* ---------------- balloons ---------------- */
  var balloonColors = ['#FF6B5B', '#F2B705', '#FFD9CE', '#E85445'];

  function spawnBalloon() {
    var $b = $('<div class="balloon"></div>');
    var left = Math.random() * 100;
    var duration = 10 + Math.random() * 8;
    var delay = Math.random() * 6;
    var color = balloonColors[Math.floor(Math.random() * balloonColors.length)];

    $b.css({
      left: left + 'vw',
      background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,.55), ' + color + ' 60%)',
      animationDuration: duration + 's',
      animationDelay: delay + 's'
    });

    $('#balloonField').append($b);

    // clean up so the DOM doesn't grow forever
    setTimeout(function () { $b.remove(); }, (duration + delay) * 1000 + 500);
  }

  for (var i = 0; i < 7; i++) spawnBalloon();
  setInterval(spawnBalloon, 3200);

  /* ---------------- candles ---------------- */
  var $candles = $('.candle');
  var $cakeMessage = $('#cakeMessage');

  function litCount() {
    return $candles.filter('[data-lit="true"]').length;
  }

  function updateMessage() {
    var remaining = litCount();
    if (remaining === 0) {
      $cakeMessage.text('Wish made ✦ Happy Birthday, Bhuvana!');
      burstConfetti();
    } else if (remaining === 1) {
      $cakeMessage.text('1 candle left to blow out');
    } else {
      $cakeMessage.text(remaining + ' candles left to blow out');
    }
  }

  $candles.attr('tabindex', 0).attr('role', 'button').attr('aria-label', 'Blow out candle');

  $candles.on('click keypress', function (e) {
    if (e.type === 'keypress' && e.which !== 13 && e.which !== 32) return;
    var $c = $(this);
    if ($c.attr('data-lit') === 'true') {
      $c.attr('data-lit', 'false');
      updateMessage();
    }
  });

  /* ---------------- celebrate button + confetti ---------------- */
  var canvas = document.getElementById('confettiCanvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var confettiColors = ['#FF6B5B', '#F2B705', '#FFD9CE', '#FFF6EE', '#E85445'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  $(window).on('resize', resizeCanvas);

  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      life: 0,
      maxLife: 140 + Math.random() * 60
    };
  }

  function burstConfetti() {
    for (var i = 0; i < 140; i++) particles.push(makeParticle());
    if (!animating) {
      animating = true;
      requestAnimationFrame(animateConfetti);
    }
  }

  var animating = false;
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (p) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.life++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    particles = particles.filter(function (p) { return p.life < p.maxLife; });

    if (particles.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      animating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  $('#celebrateBtn').on('click', function () {
    burstConfetti();
    for (var i = 0; i < 3; i++) spawnBalloon();
  });

});
