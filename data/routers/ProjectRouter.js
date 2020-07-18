const express = require("express");
const router = express.Router();
const Project = require("../helpers/projectModel")
const Action = require("../helpers/ActionModel")

router.get("/", async (req, res) => {
  try {
    const allProjects = await Project.get();
    res.status(200).json(allProjects)
  } catch(error) {
    res.status(500).json({error: "Unable to load projects."})
  }
})

router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.project)
})

router.get("/:id/actions", validateProjectId, (req, res) => {
  try{
    const projectActions = req.project.actions;
    if (projectActions.length === 0){
      res.status(200).json({message: "No actions found"})
    }else{
      res.status(200).json(projectActions)
    }
    
  } catch(error) {
    res.status(500).json({error: "Unable to retreve actions by id."})
  }
})

router.post("/", validateProject, async (req, res) => {
  try {
    const addedProject = await Project.insert(req.body);
    res.status(201).json(addedProject)
  } catch (error) {
    res.status(500).json({error: "Unable to add new project"})
  }
})

router.post("/:id/actions",validateProjectId, validateAction, projectIdMatchesParams, async (req, res) => {
  try {
    const addedAction = await Action.insert(req.body);
    res.status(201).json(addedAction)
  } catch (error) {
    res.status(500).json({error: "Unable to add new Action"})
  }
})




router.delete("/:id", validateProjectId, async (req, res) => {
  try {
    await Project.remove(req.project.id)
    res.status(202).json({message: "Project removed"})
  } catch (error) {
    res.status(500).json({error: "Unable to remove project"})
  }
})

router.put("/:id",validateProjectId, validateProject, async (req, res) => {
  try {
    const updatedProject = await Project.update(req.project.id, req.body);
    res.status(201).json({message: "Project updated.", project: updatedProject})
    
  } catch (error) {
    res.status(500).json({error: "Unable to update project"})
  }
})

// MiddleWare

async function validateProjectId(req, res, next) {
  try {
    const {id} = req.params;
    const projectById = await Project.get(id)
    if(projectById === null) {
      res.status(404).json({error: "Project id does not exist"})
    }else {
      req.project = projectById
      next();
    }
  } catch(error) {
    res.status(500).json({error: "Unable to retreve project by id"})
  }
}

function validateProject(req, res, next) {
  const newProject = req.body
  if(Object.entries(newProject) === 0){
    res.status(400).json({message: "missing required fields"})
  }else if (!newProject.name){
    res.status(400).json({message: "missing name"})
  }else if (!newProject.description){
    res.status(400).json({message: "missing description"})
  }else{
    next();
  }
}

function validateAction(req, res, next) {
  const newAction = req.body
  if(Object.entries(newAction) === 0){
    res.status(400).json({message: "missing required fields"})
  }else if (!newAction.project_id){
    res.status(400).json({message: "missing project_id"})
  }else if (!newAction.description){
    res.status(400).json({message: "missing description"})
  }else if (!newAction.notes){
    res.status(400).json({message: "missing notes"})
  }else{
    next();
  }
}

function projectIdMatchesParams(req, res, next){
  if (req.params.id == req.body.project_id){
    next();
  }else{
    res.status(400).json({message: "project id does not match"})
  }
}


module.exports = router;