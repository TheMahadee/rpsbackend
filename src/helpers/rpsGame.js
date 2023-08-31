const getWinner = (p1, p2) => {
  if (p1.choice === p2.choice) {
    return "It's a tie!";
  } else if (
    (p1.choice === "rock" && p2.choice === "scissors") ||
    (p1.choice === "paper" && p2.choice === "rock") ||
    (p1.choice === "scissors" && p2.choice === "paper")
  ) {
    return {
      msg: `${p1.name} chose ${p1.choice},\n${p2.name} chose ${p2.choice},\n${p1.name} wins!`,
      win: p1.user_id,
      lose: p2.user_id,
    };
  } else {
    return {
      msg: `${p1.name} chose ${p1.choice},\n${p2.name} chose ${p2.choice},\n${p2.name} wins!`,
      win: p2.user_id,
      lose: p1.user_id,
    };
  }
};

module.exports = { getWinner };
