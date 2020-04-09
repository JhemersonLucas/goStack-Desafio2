const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//
function logRequest(req, res, next){
  const {method, url} = req;
  const log = `[${method.toUpperCase()}] ${url}`;
  console.time(log);
  next();
  console.timeEnd(log);
}

function checkId(req, res, next){
  const {id} = req.params;
  if(!isUuid(id)){
    return res.status(400).json({error: "Informe um ID válido."});
  }
  next();
}

app.use(logRequest);
app.use('/repositories/:id', checkId);

app.get("/repositories", (req, res) => {
  // TODO
  const results = repositories;
  return res.json(results);
});

app.post("/repositories", (req, res) => {
  // TODO
  const {title, url, techs} = req.body;

  const repo = {
    id: uuid(), title, url, techs, likes: 0
  }

  repositories.push(repo);

  return res.json(repo);

});

app.put("/repositories/:id", (req, res) => {
  // TODO
  const {id} = req.params;
  const index = repositories.findIndex(r=>r.id == id);
  if(index >= 0){
    const {title, url, techs} = req.body;
    repositories[index] = {
      id,
      title,
      url,
      techs,
      likes: repositories[index].likes
    }
    return res.json(repositories[index]);
  }else return res.status(400).json({error: 'Repositório não encontrado'})
});

app.delete("/repositories/:id", (req, res) => {
  // TODO
  const {id} = req.params;
  const index = repositories.findIndex(r=>r.id == id);
  if(index >= 0){
    repositories.splice(index, 1);
    return res.status(204).json();
  }else return res.status(400).json({error: 'Repositório não encontrado'})
});

app.post("/repositories/:id/like", (req, res) => {
  // TODO
  const {id} = req.params;
  const index = repositories.findIndex(r=>r.id == id);
  if(index >= 0){
    repositories[index].likes++;
    return res.json(repositories[index]);
  }else return res.status(400).json({error: 'Repositório não encontrado'})
});

module.exports = app;
