const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const app = express();
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3009, () => {
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
  response.send(playersArray);
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
      '${role}',
  );`;
  const dbResponse = await db.run(addPlayerQuery);
  //   const player_id = dbResponse.lastId;
  response.send({ player_id: player_id });
  response.send("Player added to Team");
});

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
     role = '${role}',
    WHERE 
    player_id = ${playerId};`;
  await db.run(updatePlayerDetails);
  response.send("Player Updated Successfully");
});

//Delete Player API
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM 
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Deleted");
});

module.exports = app;
