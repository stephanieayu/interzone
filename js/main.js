/*
 *  Main function to set the clock times
 */


var date = new Date;
(function() {
  // Initialise the locale-enabled clocks
  initInternationalClocks();
  // Initialise any local time clocks
  // Start the seconds container moving
  moveSecondHands();
  // Set the intial minute hand container transition, and then each subsequent step
  setUpMinuteHands();
})();

/*
 * Set up the clocks that use moment.js
 */
function initInternationalClocks() {

  // Get the local time using JS
  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  var hours = date.getHours();

  var hands = [
    {
      hand: 'hours',
      numeral: hours,
      angle: (hours * 30) + (minutes / 2)
    },
    {
      hand: 'minutes',
      numeral: minutes,
      angle: (minutes * 6)
    },
    {
      hand: 'seconds',
      numeral: seconds,
      angle: (seconds * 6)
    }
  ];

  // Loop through each of these hands to set their angle
  for (var j = 0; j < hands.length; j++) {
    var elements = document.querySelectorAll('.' + hands[j].hand);

    for (var k = 0; k < elements.length; k++) {

        elements[k].style.webkitTransform = 'rotateZ('+ hands[j].angle +'deg)';
        elements[k].style.transform = 'rotateZ('+ hands[j].angle +'deg)';

        // If this is a minute hand, note the seconds position (to calculate minute position later)
        if (hands[j].hand === 'minutes') {
          elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
        }
    }
  }

  //digital
  var elements = document.querySelectorAll('.time-header');
  for (var k = 0; k < elements.length; k++) {

    //deal with interzones
    switch( elements[k].id ){
      case "zone1-time":
        elements[k].innerHTML = moment( date ).subtract(2,'hours').format('hh:mm:ss A');
        break;
      case "zone3-time":
        elements[k].innerHTML = moment( date ).add(2,'hours').format('hh:mm:ss A');
        break;
      default:
        elements[k].innerHTML = moment( date ).format('hh:mm:ss A');
    }
  }
  //end digital



  // Add a class to the clock container to show it
  var elements = document.querySelectorAll('.clock');
  for (var l = 0; l < elements.length; l++) {
    elements[l].className = elements[l].className + ' show';
  }

  var digital_elements = document.querySelectorAll('.time-header');
}

/*
 * Move the second containers
 */
function moveSecondHands() {
  var containers = document.querySelectorAll('.bounce .seconds-container');
  setInterval(function() {
    for (var i = 0; i < containers.length; i++) {
      if (containers[i].angle === undefined) {
        containers[i].angle = 6;
      } else {
        containers[i].angle += 6;
      }
      containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
      containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
    }

    var elements = document.querySelectorAll('.time-header');
    for (var k = 0; k < elements.length; k++) {

      //deal with interzones
      switch( elements[k].id ){
        case "zone1-time":
          elements[k].innerHTML = moment( Date.now() ).subtract(2,'hours').format('hh:mm:ss A');
          break;
        case "zone3-time":
          elements[k].innerHTML = moment( Date.now() ).add(2,'hours').format('hh:mm:ss A');
          break;
        default:
          elements[k].innerHTML = moment( Date.now() ).format('hh:mm:ss A');
      }
    }

  }, 1000);
  for (var i = 0; i < containers.length; i++) {
    // Add in a little delay to make them feel more natural
    var randomOffset = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    containers[i].style.transitionDelay = '0.0'+ randomOffset +'s';
  }
}

/*
 * Set a timeout for the first minute hand movement (less than 1 minute), then rotate it every minute after that
 */
function setUpMinuteHands() {
  // More tricky, this needs to move the minute hand when the second hand hits zero
  var containers = document.querySelectorAll('.minutes-container');
  var secondAngle = containers[containers.length - 1].getAttribute('data-second-angle');
  console.log(secondAngle);
  if (secondAngle > 0) {
    // Set a timeout until the end of the current minute, to move the hand
    var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
    console.log(delay);
    setTimeout(function() {
      moveMinuteHands(containers);
    }, delay);
  }
}

/*
 * Do the first minute's rotation, then move every 60 seconds after
 */
function moveMinuteHands(containers) {
  for (var i = 0; i < containers.length; i++) {
    containers[i].style.webkitTransform = 'rotateZ(6deg)';
    containers[i].style.transform = 'rotateZ(6deg)';
  }
  // Then continue with a 60 second interval
  setInterval(function() {
    for (var i = 0; i < containers.length; i++) {
      if (containers[i].angle === undefined) {
        containers[i].angle = 12;
      } else {
        containers[i].angle += 6;
      }
      containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
      containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
    }
  }, 60000);
}


