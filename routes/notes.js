const express = require('express');
const router = express.Router();
var fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// get all the notes
router.get('/fetchallnotes',fetchUser,async(req,res)=>{
    try {
        const notes = await Notes.find({user:req.userID});
        res.json(notes)
    } catch (error) {
        console.log(error);
        res.json({err:"something went worng"})
    }
})
// add note
router.post('/addnote',fetchUser,[
    body('title','enter a valid title').isLength({ min: 3 }),
    body('description','enter a valid description').isLength({ min: 3 }),
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    try {
        const notes = new Notes({
            title:req.body.title,
            description:req.body.description,
            tag: req.body.tag,
            user: req.userID
        })
        const savedNote = await notes.save();
        res.json(savedNote);
        
    } catch (error) {
        
        res.json({erro :"error"})
    }
})


//update note
router.put('/updatenote/:id',fetchUser,[
    body('title','enter a valid title').isLength({ min: 3 }),
    body('description','enter a valid description').isLength({ min: 3 }),
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {title,description,tag} = req.body;
        const newNote ={}
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        let note = await Notes.findById(req.params.id);
        
        if(!note){res.status(404).send('Not found')}
        
        if(note.user.toString() !== req.userID){
            res.status(401).send("not allowed")
        }
        console.log(newNote);
        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        console.log(note);
        res.json(newNote);
        
    } catch (error) {
        res.json({err:'Internal server error'})
        
    }
    
})


// delete the notes
router.delete('/deletenote/:id',fetchUser,async(req,res)=>{
    try {
        let note = await Notes.findById(req.params.id);
        
        if(!note){res.status(404).send('Not found')}
        
        if(note.user.toString() !== req.userID){
            res.status(401).send("not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id,{new:true});
        res.send('user deleted')
    } catch (error) {
        
    }
})

module.exports = router