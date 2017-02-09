document.addEventListener("DOMContentLoaded", function(event) { 

  //I got frustrated trying to code this generically without bootstrap.js
  //so I hard coded the close button on the the one lone alert
  document.getElementById("close1").onclick = function() {
    document.getElementById("alert1").style.display = "none";
  };

  var hangman = {
    listWords: ["GEOCITIES", "NINETIES", "CLARISSA", "NICKLEODEON", "MOONSHOES",
      "WORDART", "VANILLA ICE", "GOOSEBUMPS", "AMERICA ONLINE"],
    guessArray: [],
    wins: 0,
    guesses: 6,
    currentWordIndex: -1,
    currentWord:[],
    currentWordGuessed: false,


    //set's up the initial values of the game
    //if nothing is passed, wins start at 0, otherwise wins is set to start_wins
    //Picks a random word from the listWords
    initalize: function(start_wins=0) {
      this.currentWordIndex = Math.floor(Math.random()*this.listWords.length);
      this.setCurrentWord(this.listWords[this.currentWordIndex]);
      this.guesses=6;
      this.wins=start_wins;
      this.currentWordGuessed=false;
      this.guessArray=[];
      this.display_status("Press any key to play!");
      this.update_display();

    },

    //fills out the currentWord array, which we use as a masking array of booleons
    setCurrentWord: function(word){
      this.currentWordLength=word.length;
      this.currentWord=[];
      for(var i=0; i<word.length; ++i){
        if(word.charAt(i)===' ')
          this.currentWord.push(true);
        else
          this.currentWord.push(false);
      }
    },

    //Fills in the html of #guesses-remaining with a the number of guesses remaining
    display_guesses_remaining: function() {
      var myDiv= document.getElementById("guesses-remaining");
      myDiv.innerHTML = this.guesses;
    },

    //Fills in the html of #wins with the number of wins currently
    display_wins: function() {
      var myDiv= document.getElementById("wins");
      myDiv.innerHTML = this.wins;
    },

    //Fills in the html of the #letters-guessed with the list of letters already guesse
    display_guesses: function() {
      var myDiv= document.getElementById("letters-guessed");
      var tempStr= "";
      for(var i=0; i<this.guessArray.length; ++i){
        tempStr=tempStr+this.guessArray[i]+" ";
      }
      //console.log(tempStr);
      if(tempStr==="")
        myDiv.innerHTML = "None";
      else
        myDiv.innerHTML = tempStr;
    },

    //Fills in the html of #hidden-word with either _ or the letter of the word, depending on the mask of currentWord array
    display_word: function() {
      var myDiv= document.getElementById("hidden-word");
      var tempStr ="";
      var tempChar="";
      for(var i=0; i<this.currentWordLength; ++i){
        if(this.currentWord[i]) {
          tempChar=this.listWords[this.currentWordIndex].charAt(i);
          tempStr=tempStr+tempChar+"&nbsp;";
        }
        else {
          tempStr=tempStr+"_"+"&nbsp;";
        }
      }

      myDiv.innerHTML = tempStr;
    },

    //Fills in the html of #game-status with the supplied string
    display_status: function(str) {
      var myElement= document.getElementById("game-status");
      myElement.innerHTML = str;

    },

    //Runs most of the display functions
    update_display: function() {
      this.display_guesses();
      this.display_word();
      this.display_guesses_remaining();
      this.display_wins();
    },

    //Checks to see if the letter_pass char is in the word, if yes returns true, othrewise false
    //Also modifies the currentWord mask if it finds the matching character
    in_word: function(letter_pass) {
      var tempWord=this.listWords[this.currentWordIndex];
      var isInWord=false;
      for(var i=0; i<tempWord.length; ++i){
        if(letter_pass === tempWord.charAt(i)) {
          isInWord=true;
          this.currentWord[i]=true;
        }
      }

      return isInWord;
    },

    //Checks to see if the current word hs been guessed by running through the currentWord mask
    //if currentWord contains all trues, then the word is guessed
    //returns true or false
    current_word_guessed: function() {
      var isGuessed=true;
      for(var i=0; i<this.currentWord.length; ++i){
        isGuessed=isGuessed && this.currentWord[i];
      }
      return isGuessed;
    },

    //This function is called when the game is won
    //Increments the number of wins, and adds a button to continue on with the game.
    you_win: function() {
      ++this.wins;
      var tempStr="You win, correctly guessed: "+this.listWords[this.currentWordIndex];
      tempStr+="<br>Press continue to go on to next word! <button id=\"replay\" class=\"btn btn-primary\">Continue</button>";
      this.display_status(tempStr);

      //Probably not the best way to do this, as it needs thsi specific named instance fof the game to be delard golbally
      var myElement= document.getElementById("replay");
      myElement.onclick = function () {
        hangman.initalize(hangman.wins);
      };

      myElement = document.getElementById("my-audio-1");
      myElement.volume = 0.2;
      myElement.play();
    },

    //This function is called when you run out of guesses for the current word
    // adds a button to reset the game to it's defualt state
    you_lose: function() {
      var tempStr="You lose! The word was: "+ this.listWords[this.currentWordIndex]
        +"<br>Press replay to play again! <button id=\"replay\" class=\"btn btn-danger\">>Replay</button>";
      this.display_status(tempStr);

      //Probably not the best way to do this, as it needs this specific named instance fof the game to be delard golbally
      var myElement= document.getElementById("replay");
      myElement.onclick = function () {
        hangman.initalize();
      };
    },

    //helper of run_game, takes a letter and checks to see if it is has allready been guessed
    //Updates ont the display_status based if the letter has been gussed already
    //Then checks to see if the letter is in the current word, if not guesses is decremented
    guess_letter: function(letter_pass) {
      for(var i=0; i<this.guessArray.length; ++i){
        if(letter_pass===this.guessArray[i]) {
          this.display_status("You already guessed the letter: "+letter_pass);
          var myElement = document.getElementById("my-audio-2");
          myElement.volume = 0.2;
          myElement.play();
          return;
        }
      }

      this.guessArray.push(letter_pass);
      this.display_status("You guessed the letter: "+letter_pass);
      var myElement = document.getElementById("my-audio-3");
      myElement.volume = 0.2;
      myElement.play();
      
      if(!this.in_word(letter_pass)) {
        --this.guesses;
      }

      return;
    },

    //main process of the game, first checks to see if the game has ended, if not and guesses >0,
    //calls guess_letter with the letter, and updates the display
    //then checks again to see if the word has been guessed
    //if guesses is 0 due to wrong guesses, you_lose is called
    //if the word has been guessed and guesses > 0, you win is called
    run_game: function(letter_pass) {
      var gameComplete=this.current_word_guessed();
      if(this.guesses>0 && !gameComplete) {
        this.guess_letter(letter_pass);
        this.update_display();
      }

      gameComplete=this.current_word_guessed();

      if(this.guesses===0){
        this.update_display();
        this.you_lose();
      }
      else if(gameComplete && this.guesses>0) {
        this.update_display();
        this.you_win();
      }
    }


  };


hangman.initalize();
hangman.update_display();

document.onkeydown = function(event) {
  var tempChar=event.key.toUpperCase();
  var keyCode=event.keyCode;
  //console.log(tempChar);
  //console.log(keyCode);
  if(keyCode>64 && keyCode<91) {
    hangman.run_game(tempChar);
  }
};


});