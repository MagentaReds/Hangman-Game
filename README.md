# Hangman-Game

~~I haven't fully divorced the hangman object from the DOM interaction.  If I have time, I'll go back and redo the hangman object to be purely about the game code, and then I'll have a helper object hangman displayer/interactor that implements the hangman game into my webpage.~~

~~Idea is, people can take the hangman game object, then right their own displayer for the webpage they want.~~

I did that thing I said I was going to do.

For the Css/bootstrap, I used the April fools bootstrap theme from here http://code.divshot.com/geo-bootstrap/
It uses a fairly old version of bootstrap circa 2012, but works well enough.  I added my own little touches like a fake webring and and a dismissable alert.

From the code comments:
```
  //Hangman main object. Defines the game, and mostly runs it.
  //call hangman.initialize() to set up the first round of the game, then call hangman.guess_letter(letter) to step through the game
  //hangman.guess_letter() will return true if the game round has ended, false otherwise.
  //if the game round has ended, calling hangman.guess_letter() again won't do anything besides return true
  //access the memember varibles (.isLoss, .currentWord, .hiddenWord etc.) as needed.
  //Once the game round ends, call hangman.nextRound() to begin the next round
```
