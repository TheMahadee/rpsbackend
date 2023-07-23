export const getWinner = (playerChoice, opponentChoice) => {
  if (playerChoice === opponentChoice) {
    return "It's a tie!";
  } else if (
    (playerChoice === "rock" && opponentChoice === "scissors") ||
    (playerChoice === "paper" && opponentChoice === "rock") ||
    (playerChoice === "scissors" && opponentChoice === "paper")
  ) {
    return "You win!";
  } else {
    return "You lose!";
  }
};
