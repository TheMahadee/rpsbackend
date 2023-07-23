const socket = io();
var roomId = 10,
  usrName = 10;
const resultDiv = document.getElementById("result");

function joinRoom() {
  roomId = document.getElementById("room").value;
  usrName = document.getElementById("name").value;
  if (roomId === undefined || roomId === "") {
    resultDiv.innerHTML = "Please enter a room number!!!";
  } else if (usrName === undefined || usrName === "") {
    resultDiv.innerHTML = "Please enter a name!!!";
  } else {
    socket.emit("joinRoom", roomId);
  }
}

function choose(sel) {
  resultDiv.innerHTML = "";
  let params = { room: roomId, usr: usrName, choice: sel };
  socket.emit("choose", params);
}

socket.on("result", (data) => {
  const { p1, p2, result } = data;
  resultDiv.innerHTML = `You chose ${p1}. Opponent chose ${p2}. ${result}`;
});

socket.on("roomFull", () => {
  resultDiv.innerHTML = "Sorry, the room is full";
});
