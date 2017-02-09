# Hangman-Game

~~I haven't fully divorced the hangman object from the DOM interaction.  If I have time, I'll go back and redo the hangman object to be purely about the game code, and then I'll have a helper object hangman displayer/interactor that implements the hangman game into my webpage.

Idea is, people can take the hangman game object, then right their own displayer for the webpage they want.~~

I did that thing I said I was going to do.

As a side note, I could have made hangman.guess_letter() return true/false based on if the game has ended, rather than having it return true/false based on if the character is repeated.  I decided to keep it the way it is now beause cause I figured chaning it wouldn't be that much more helpful.  And I'd have to add logic/another member variable to the hangman object that holds ifLastLetterAlreadyGuessed value while I already had the isOver member variable.