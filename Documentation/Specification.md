
# Specification

*How the mini-game works.*

<br>

## Guidelines

-   Line Length : `12` 

-   Rows : `17`

-   Selecting matching brackets will either <br>
    remove a dud or restore attempts.

-   Matching brackets will always be on the same line.

-   Guesses may be broken into two lines.

-   Guesses have a different length depending <br>
    on the security level of the terminal.

-   Circular Navigation

    -   ⮟  from the last line should <br>
             go back to the top line.
    
    -   ⮝  from the top line should <br>
             go down to the last line.
    
    -   ⮜  from the start of line should <br>
            go to the end of previous line.
    
    -   ⮞  from end of line should go <br>
            to the start of next line.


<br>
<br>

## Steps

1.  Generate a random 'memory address'.

2.  Determine special characters set.

3.  Generate text for each line <br>
    with special characters only.

4.  Make each character selectable.

5.  Implement keyboard navigation.

<br>