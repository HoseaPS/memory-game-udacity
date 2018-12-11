/*
 * Create a list that holds all of your cards
 */
var cardList = [
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-leaf",
  "fa-bicycle",
  "fa-bomb"
];

// numero de movimentos feitos
// e quantos deram match
var moves = 0;
var match = 0;

// verifica quando o jogo começou
var startGame = false;

// cronometro
var timer = new Timer();
timer.addEventListener("secondsUpdated", function(e) {
  $("#timer").html(timer.getTimeValues().toString());
});

// botao de reset
$("#reset-button").click(function() {
  moves = 0;
  match = 0;
  $(".deck").empty();
  $(".stars").empty();
  startGame = false;
  timer.stop();
  $("#timer").html("00:00:00");
  initGame();
});

// colocando o card aleatoriamente no deck
function generateCards() {
  for (var i = 0; i < 2; i++) {
    cardList = shuffle(cardList);
    cardList.forEach(function(item) {
      $(".deck").append(
        `<li class="card animated"><i class="fa ${item}"></i></li>`
      );
    });
  }
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// array dos cards já abertos
openedCards = [];

function checkCard() {
  if (startGame == false) {
    startGame = true;
    timer.start();
  }

  if (openedCards.length === 0) {
    $(this)
      .toggleClass("show open")
      .animateCss("flipInY");
    openedCards.push($(this));
    openedCards.forEach(function(card) {
      card.off("click");
    });
  } else if (openedCards.length === 1) {
    updateMoves();
    $(this)
      .toggleClass("show open")
      .animateCss("flipInY");
    openedCards.push($(this));
    setTimeout(function() {
      if (
        openedCards[0][0].firstChild.className ==
        openedCards[1][0].firstChild.className
      ) {
        openedCards[0].addClass("match").animateCss("shake");
        openedCards[1].addClass("match").animateCss("shake");
        openedCards.forEach(function(card) {
          card.off("click");
        });
        openedCards = [];
        setTimeout(function() {
          match += 1;
          if (match == 8) {
            showResults();
          }
        }, 250);
      } else {
        openedCards[0].toggleClass("show open").animateCss("flipInY");
        openedCards[1].toggleClass("show open").animateCss("flipInY");
        openedCards[0].click(checkCard);
        openedCards = [];
      }
    }, 1100);
  }
}

// function to add animations https://github.com/daneden/animate.css/
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: "animationend",
        OAnimation: "oAnimationEnd",
        MozAnimation: "mozAnimationEnd",
        WebkitAnimation: "webkitAnimationEnd"
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement("div"));

    this.addClass("animated " + animationName).one(animationEnd, function() {
      $(this).removeClass("animated " + animationName);

      if (typeof callback === "function") callback();
    });

    return this;
  }
});

function updateMoves() {
  moves += 1;
  $(".moves").html(`${moves} ${moves > 1 ? "Movimentos" : "Movimento"}`);
  //caso faça mais de 16 movimentos, irá perder mais uma estrela
  if (moves == 24) {
    $(".stars")
      .children()[0]
      .remove();
    $(".stars").append('<li><i class="fa fa-star-o"></i></li>');
    //caso faça mais de 16 movimentos, irá perder uma estrela
  } else if (moves == 16) {
    $(".stars")
      .children()[0]
      .remove();
    $(".stars").append('<li><i class="fa fa-star-o"></i></li>');
  }
}

// função para iniciar o game
function initGame() {
  generateCards();
  $(".card").click(checkCard);
  $(".moves").html("0 Movimentos");
  for (var i = 0; i < 3; i++) {
    $(".stars").append('<li><i class="fa fa-star"></i></li>');
  }
}

// mostrar resultados depois que acabar
function showResults() {
  $("#final-results").empty();
  timer.pause();
  var results = `
        <p class="success">Parabéns</p>
        <div class="final-results-score">
            <div>
              <span class="final-titles">Movimentos feitos:</span>
              <span class="final-values">${moves}</span>
            </div>
           <div>
              <span class="final-titles">Tempo:</span>
              <span class="final-values">${timer
                .getTimeValues()
                .toString()}</span>
           </div>
        </div>
        <div class="final-stars">
             <div class="star">
                <i class="fa fa-star fa-3x"></i>    
             </div>
             <div class="star">
                <i class="fa ${
                  moves > 23 ? "fa-star-o" : "fa-star"
                }  fa-3x"></i>    
             </div>
            <div class="star">
                <i class="fa ${
                  moves > 14 ? "fa-star-o" : "fa-star"
                } fa-3x"></i>    
             </div>
        </div>
        <div class="final" id="restart">
          <i class="fa fa-repeat fa-2x"></i>
        </div>
    `;
  $(document.body).addClass("finalResults");
  $("#final-results").append($(results));
  $("#restart.final").click(function() {
    location.reload();
  });
}

initGame();
