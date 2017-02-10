document.addEventListener("DOMContentLoaded", function(event) { 

  //I got frustrated trying to code this generically without bootstrap.js
  //so I hard coded the close button on the the one lone alert
  document.getElementById("close1").onclick = function() {
    document.getElementById("alert1").style.display = "none";
  };

  //Hangman main object. Defines the game, and mostly runs it.
  //call hangman.initialize() to set up the first round of the game, then call hangman.guess_letter(letter) to step through the game
  //hangman.guess_letter() will return true if the game round has ended, false otherwise.
  //access the memember varibles (.isLoss, .currentWord, .hiddenWord etc.) as needed.
  //Once the game ends, call hangman.nextRound() to start the next round/reset the game upon a loss.
  var hangman = {
    listWords: ["GEOCITIES", "NINETIES", "CLARISSA", "NICKLEODEON", "MOONSHOES",
      "WORDART", "VANILLA ICE", "GOOSEBUMPS", "AMERICA ONLINE"],
    guessArray: [],
    winStreak: 0,
    guesses: 6,
    currentWord: "",
    maskArray: [],
    isOver: false,
    isLoss: false,
    hiddenWord: "",
    lastGuessIsRepeat: false,

    //Sets up the variables, can pass number of wins to set them to that.
    initialize: function(given_wins=0) {
      this.guessArray = [];
      this.winStreak = given_wins;
      this.guesses=6;
      this.currentWord = this.listWords[Math.floor(Math.random()*this.listWords.length)];
      this.setMask();
      this.hiddenWord=this.getDisplayWord();
      this.isOver=false;
      this.isLoss=false;
      this.lastGuessIsRepeat=false;

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

    nextRound: function() {
      if(this.isOver) {
        if(this.isLoss)
          this.initialize(0);
        else
          this.initialize(this.winStreak);
      }
    },

    //main function of hangman, checks to see if game is over, if not, checks to see if the letter is in the word.  If it is not, then the gusses is decremneted, if so, the mask is updated and so is the display word
    // guesses is not decremented if the letter has already been wrongly guessed
    // then it checks to see if the games has ended and whether it is a loss or a win, and updates isLoss and isOver accordingly
    // also sets lastGuessIsRepeat to true if the letter passed is  repeat guess, sets to false otherwise
    //  returns true if the game is over, false otherwise
    guess_letter: function(letter) {


      if(!this.isOver){
        this.lastGuessIsRepeat=this.addGuess(letter);

        if(this.check_letter(letter)) {
          this.updateMask(letter);
          this.hiddenWord=this.getDisplayWord();
        }
        else if(!this.lastGuessIsRepeat){
          --this.guesses;
        }


        var myStatus=this.getStatus();
        if(myStatus===1){
          ++this.winStreak;
          this.isOver=true;
          this.isLoss=false;
        }
        else if(myStatus===-1) {
          this.isOver=true;
          this.isLoss=true;
        }

      }
      
      return this.isOver;

    }

  };

  //an implementation of the hangman game into displaying it via html
  var hangman_runner = {
    statusElement: document.getElementById("game-status"),
    winsElement: document.getElementById("wins"),
    hiddenElement: document.getElementById("hidden-word"),
    lettersElement: document.getElementById("letters-guessed"),
    guessesElement: document.getElementById("guesses-remaining"),


    //calls hangman.nextRound() and displays the html displays
    resetGame: function() {
      hangman.nextRound();
      this.displayEverything();
      this.statusElement.innerHTML = "Press any key to play!";

    },

    //returns a string with an extra space between each character of the array of chars or input string.
    addSpaces: function(str) {
      if(str.length===0)
        return "None";

      var tempStr="";
      for(var i=0; i<str.length; ++i){
        tempStr=tempStr+str[i]+"&nbsp;";
      }
      return tempStr;
    },

    //Displays the wins, hidden word, letters guessed, and guesses remaining to the appropiate html spots.
    displayEverything: function() {
      this.winsElement.innerHTML = hangman.winStreak;
      this.hiddenElement.innerHTML = this.addSpaces(hangman.hiddenWord);
      this.lettersElement.innerHTML = this.addSpaces(hangman.guessArray);
      this.guessesElement.innerHTML = hangman.guesses;

    },

    //main hookup to the hangman object.  Calls hangman.guessletter, and does stuff based on its response, and if the game has ended or not
    runGame: function(letter) {

      this.displayEverything();

      if(hangman.guess_letter(letter)) {
        if(hangman.isLoss){
          this.statusElement.innerHTML = "You lose! The word was: "+hangman.currentWord +"<br>Press replay to start again <button id=\"replay\" class=\"btn btn-danger\">Replay?</button>";

          document.getElementById("replay").onclick = function () {
            hangman_runner.resetGame();
          };
        }
        else {
          this.statusElement.innerHTML = "You win, correctly guessed: "+hangman.currentWord +"<br>Press continue to go on to next word! <button id=\"replay\" class=\"btn btn-primary\">Continue</button>";
          
          document.getElementById("replay").onclick = function () {
            hangman_runner.resetGame();
          };

          myElement = document.getElementById("my-audio-1");
          myElement.volume = 0.2;
          myElement.play();
        }
      
      }
      else {
        if(hangman.lastGuessIsRepeat) {
          this.statusElement.innerHTML = "You already guessed the letter: "+letter;
          var myElement = document.getElementById("my-audio-2");
          myElement.volume = 0.2;
          myElement.play();
        }
        else {
          this.statusElement.innerHTML = "You have guessed the letter: "+letter;
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