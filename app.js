const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost/3009");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//Get Players API
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

// Get Player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
     *
    FROM
     cricket_team
    WHERE
     player_id = ${playerId};`;
  const playerArray = await db.get(getPlayerQuery);
  response.send(convertDbObjectToResponseObject(playerArray));
});

// //Add Player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO
   cricket_team(player_name, jersey_number, role)
  VALUES(
      '${playerName}',
      ${jerseyNumber},
      '${role}'
  );`;
  const dbResponse = await db.run(addPlayerQuery);
<<<<<<< HEAD
  //   const player_id = dbResponse.lastID;
  //   response.send({ player_id: player_id });
  response.send("Player Added to Team");
=======
  //   const player_id = dbResponse.lastId;
  //response.send({ player_id: player_id });
  response.send("Player added to Team");
>>>>>>> ce47c6e03f1856c78ba5dcfd85793d9737aef050
});

//update Player
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatePlayerDetails = request.body;
  const { playerName, jerseyNumber, role } = updatePlayerDetails;
  const updatePlayerQuery = `
    UPDATE
    cricket_team
    SET 
     player_name = '${playerName}',
     jersey_number = ${jerseyNumber},
     role = '${role}'
    WHERE 
     player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//Delete Player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM 
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
