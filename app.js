const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => 
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) =>{
    return(
        requestQuery.priority !== undefined && requestQuery.status !== undefined; 
    );
}; 

const hasPriorityProperty = (requestQuery) =>{
    return requestQuery.priority !==undefined; 
}; 

const hasStatusProperty = (requestQuery) =>{
    return requestQuery.status !== undefined; 
}; 

app.get("/todos/",async(request,response) =>{
    let data = null; 
    let getTodosQuery = ""; 
    const {search_q = "",priority,status} = request.query;
    switch(true){
      case   hasPriorityAndStatusProperties(request.query):
        getTodosQuery = `SELECT * FROM todo WHERE 
         todo LIKE '%${search_q}%' 
         AND status = '${status}' 
         AND priority = '${priority}';`;
         break; 

    case hasPriorityProperty(request.query):
       getTodosQuery = `SELECT * FROM todo WHERE todo LIKE '${search_q}' 
       AND priority = '${priority}'; `; 
       
       break; 

       case hasStatusProperty(request.query):
        getTodosQuery = `SELECT * FROM todo WHERE todo LIKE '${search_q} AND status = '${status}';`; 

        break; 

        default:
            getTodosQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
    }
    data = await db.all(getTodosQuery); 
    response.send(data); 

});

module.exports = app; 
