document.addEventListener("DOMContentLoaded", function(event) { 

  //I got frustrated trying to code this generically without bootstrap.js
  //so I hard coded the close button on the the one lone alert
  document.getElementById("close1").onclick = function() {
    document.getElementById("alert1").style.display = "none";
  };

  //Hangman main object Defienes the game, and mostly runs it.
  var hangman = {
    listWords: ["GEOCITIES", "NINETIES", "CLARISSA", "NICKLEODEON", "MOONSHOES",
      "WORDART", "VANILLA ICE", "GOOSEBUMPS", "AMERICA ONLINE"],
    guessArray: [],
    wins: 0,
    guesses: 6,
    currentWord: "",
    maskArray: [],
    isOver: false,
    isLoss: false,
    displayWord: "",

    //Sets up the variables, can pass number of wins to set them to that.
    initialize: function(given_wins=0) {
      this.guessArray = [];
      this.wins = given_wins;
      this.guesses=6;
      this.currentWord = this.listWords[Math.floor(Math.random()*this.listWords.length)];
      this.setMask();
      this.displayWord=this.getDisplayWord();
      this.isOver=false;
      this.isLoss=false;

    },

    //Rebuilds the mask array for hiding unguessed cahracters in display word
    setMask: function() {
      this.maskArray=[];
      for(var i=0; i<this.currentWord.length; ++i){
        if(this.currentWord[i]===' ' || this.guessArray.includes(this.currentWord[i]) )
          this.maskArray.push(true);
        else
          this.maskArray.push(false);
      }
    },

    //updates the masking array based on the letter, faster than just calling setMask again.
    updateMask: function(letter) {
      for(var i=0; i<this.currentWord.length; ++i)
        if(this.currentWord[i]===letter) 
          this.maskArray[i]=true;
    },

    //returns the current word with unguessed charcters set to _
    getDisplayWord: function() {
      var tempStr="";
      for(var i=0; i<this.currentWord.length; ++i){
        if(this.maskArray[i])
          tempStr+=this.currentWord[i];
        else
          tempStr+='_';
      }

      return tempStr;
    },

    //returns true if the letter is in the current word, otherwise false
    check_letter: function(letter) {
      for(var i=0; i<this.currentWord.length; ++i) {
        if(letter===this.currentWord[i])
          return true;
      }
      return false;
    },

    //adds the letter to the guessArray, returns true if letter is already in the guessArray, false otherwise
    addGuess: function(letter) {
      if(!(this.guessArray.includes(letter)) ) {
        this.guessArray.push(letter);
        return false;
      }
      return true;
    },

    //returns -1 if the game state is a loss, returns 0 if the game is ongoing, returns 1 if the game is a win
    getStatus: function() {
      if(this.guesses===0)
        return -1;

      var tempBool = true;
      for(var i=0; i<this.currentWord.length; ++i){
        tempBool&=this.maskArray[i];
      }

      if(tempBool)
        return 1;
      else
        return 0;
    },

    //main function of hangman, checks to see if game is over, if not, checks to see if the letter is in the word.  If it is not, then the gusses is decremneted, if so, the mask is updated and so is the display word
    // guesses is not decremented if the letter has already been wrongly guessed
    // then it checks to see if the games has ended and whether it is a loss or a win, and updates isLoss and isOver accordingly
    //also returns true if the letters has already been guessed, false otherwise
    guess_letter: function(letter) {

      var alreadyGuessed=false;

      if(!this.isOver){
        alreadyGuessed=this.addGuess(letter);

        if(this.check_letter(letter)) {
          this.updateMask(letter);
          this.displayWord=this.getDisplayWord();
        }
        else if(!alreadyGuessed){
          --this.guesses;
        }


        var myStatus=this.getStatus();
        if(myStatus===1){
          ++this.wins;
          this.isOver=true;
          this.isLoss=false;
        }
        else if(myStatus===-1) {
          this.isOver=true;
          this.isLoss=true;
        }

      }
      
      return alreadyGuessed;

    }

  };

  //an implementation of the hangman game into displaying it via html
  var hangman_runner = {
    statusElement: document.getElementById("game-status"),
    winsElement: document.getElementById("wins"),
    hiddenElement: document.getElementById("hidden-word"),
    lettersElement: document.getElementById("letters-guessed"),
    guessesElement: document.getElementById("guesses-remaining"),


    //calls hangman.initlize with the number of wins sent to it, and displays the html displays
    resetGame: function(wins) {
      hangman.initialize(wins);
      this.displayEverything();
      this.statusElement.innerHTML = "Press any key to play!";

    },

    //returns a string with an extra space between each character of the array of chars or input string.
    addSpaces: function(str) {
      var tempStr="";
      for(var i=0; i<str.length; ++i){
        tempStr=tempStr+str[i]+"&nbsp;";
      }
      return tempStr;
    },

    //Displays the wins, hidden word, letters guessed, and guesses remaining to the appropiate html spots.
    displayEverything: function() {
      this.winsElement.innerHTML = hangman.wins;
      this.hiddenElement.innerHTML = this.addSpaces(hangman.displayWord);
      this.lettersElement.innerHTML = this.addSpaces(hangman.guessArray);
      this.guessesElement.innerHTML = hangman.guesses;

    },

    //main hookup to the hangman object.  Calls hangman.guessletter, and does stuff based on its response, and if the game has ended or not
    runGame: function(letter) {
      //runs the game by one step, returns true if letter is already geussed, false if otherwise
      var alreadyGuessed=hangman.guess_letter(letter);
      this.displayEverything();

      if(hangman.isOver){
        if(hangman.isLoss){
          this.statusElement.innerHTML = "You lose! The word was: "+hangman.currentWord +"<br>Press replay to start again <button id=\"replay\" class=\"btn btn-danger\">Replay?</button>";

          var myElement= document.getElementById("replay");
          myElement.onclick = function () {
            hangman_runner.resetGame(0);
          };
        }
        else {
          this.statusElement.innerHTML = "You win, correctly guessed: "+hangman.currentWord +"<br>Press continue to go on to next word! <button id=\"replay\" class=\"btn btn-primary\">Continue</button>";
          //Probably not the best way to do this, as it needs thsi specific named instance fof the game to be delard golbally
          var myElement= document.getElementById("replay");
          myElement.onclick = function () {
            hangman_runner.resetGame(hangman.wins);
          };
          myElement = document.getElementById("my-audio-1");
          myElement.volume = 0.2;
          myElement.play();
        }
      
      }
      else {
        if(alreadyGuessed) {
          this.statusElement.innerHTML = "You already guessed: "+letter;
          var myElement = document.getElementById("my-audio-2");
          myElement.volume = 0.2;
          myElement.play();
        }
        else {
          this.statusElement.innerHTML = "You have guessed: "+letter;
          var myElement = document.getElementById("my-audio-3");
          myElement.volume = 0.2;
          myElement.play();
        }
      }

      this.displayEverything();
    }


  };

  //binding the hangman_runner.runGame(letter) call to ondownkey
  document.onkeydown = function(event) {
  var tempChar=event.key.toUpperCase();
  var keyCode=event.keyCode;

  if(keyCode>64 && keyCode<91) {
    hangman_runner.runGame(tempChar);
  }
};


  //inital calls to get the game setup and started.
  hangman.initialize();
  hangman_runner.resetGame(0);

});