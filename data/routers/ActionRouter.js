const express = require("express");
const router = express.Router();
const Action = require("../helpers/actionModel")


router.get("/", async (req, res) => {
  try {
    const allActions = await Action.get();
    res.status(200).json(allActions)
  } catch(error) {
    res.status(500).json({error: "Unable to load Actions."})
  }
})

router.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(req.Action)
})

router.delete("/:id", validateActionId, async (req, res) => {
  try {
    await Action.remove(req.Action.id)
    res.status(202).json({message: "Action removed"})
  } catch (error) {
    res.status(500).json({error: "Unable to remove Action"})
  }
})

router.put("/:id",validateActionId, validateAction, async (req, res) => {
  try {
    const updatedAction = await Action.update(req.Action.id, req.body);
    res.status(201).json({message: "Action updated.", Action: updatedAction})
    
  } catch (error) {
    res.status(500).json({error: "Unable to update Action"})
  }
})

// MiddleWare

async function validateActionId(req, res, next) {
  try {
    const {id} = req.params;
    const ActionById = await Action.get(id)
    if(ActionById === null) {
      res.status(404).json({error: "Action id does not exist"})
    }else {
      req.Action = ActionById
      next();
    }
  } catch(error) {
    res.status(500).json({error: "Unable to retreve Action by id"})
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



module.exports = router;