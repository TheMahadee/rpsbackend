var roomId, usrName, userId;
userId = generateId(1, 99);
const socket = io("http://127.0.0.1:3000", { query: { user_id: userId } });
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
  resultDiv.innerHTML = "You have selected " + sel + "!!!";
  let params = { room: roomId, usr: usrName, choice: sel, id: userId };
  socket.emit("choose", params);
}

function clearDiv() {
  console.log("ClearDiv");
  resultDiv.innerHTML = "";
}

socket.on("result", (result) => {
  console.log(result);
  resultDiv.innerHTML = result;
});

socket.on("roomFull", () => {
  resultDiv.innerHTML = "Sorry, the room is full";
});

function generateId(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
