Guidelines:

- Rows: 17
- Line Length: 12
- Selecting matching brackets will either remove a dud or restore attempts
- Matching brackets will always be on the same line
- Guesses may be broken into two lines
- Navigation should be circular:
  - Moving down from the last line should go back to the top line
  - Moving up from the top line should go down to the last line
  - Moving left from the start of line should go to the end of previous line
  - Moving right from end of line should go to the start of next line
- Guesses have different length depending on how secure the terminal is

Steps:

- Generate a random "memory address"
- Determine special characters set
- Generate text for each line with special characters only
- Make each character selectable
- Implement keyboard navigation
