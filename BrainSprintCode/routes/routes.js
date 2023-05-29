//Followed the tutorial of: https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/

const express = require("express");
const Model = require("../models/model");
const UserModel = require("../models/userModel");

const router = express.Router();

module.exports = router;

//Post Method
router.post("/post", async (req, res) => {
  const data = new Model({
    title: req.body.title,
    userId: req.body.userId,
    description: req.body.description,
    question: req.body.question,
    visibility: req.body.visibility,
    views: 0,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
//How to specify a query: https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/
router.get("/getAll", async (req, res) => {
  try {
    const data = await Model.find({
      visibility: { $eq: true },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getPrivatQuizzes", async (req, res) => {
  try {
    let data = [];
    if (req.user.owner) {
      for (let i = 0; i < req.user.owner.length; i++) {
        quiz = await Model.find({
          userId: { $eq: req.user.owner[i] },
        });
        data.push(quiz);
      }
    }
    if (req.user.added) {
      for (let i = 0; i < req.user.added.length; i++) {
        quiz = await Model.find({
          userId: { $eq: req.user.added[i] },
        });
        data.push(quiz);
      }
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/getOne/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/isOwner/:id", async (req, res) => {
  try {
    const data = await Model.find({
      userId: { $eq: req.params.id },
    });
    console.log(req.user.owner);
    if (req.user.owner.includes(data[0].userId)) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get currentlyPlaying Quiz

router.get("/getCurrentlyPlaying/", async (req, res) => {
  try {
    const currentlyPlaying = req.user.currentlyPlaying;
    res.json(currentlyPlaying);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Add currentlyPlaying Quiz

router.patch("/addCurrentlyPlaying/", async (req, res) => {
  try {
    const updatedData = req.body;
    const options = { new: true };

    const result = await UserModel.findByIdAndUpdate(
      req.user._id,
      updatedData,
      options
    );

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Add added Quiz

router.patch("/addQuiz/:id", async (req, res) => {
  try {
    let owner = [];
    if (req.user.owner !== []) {
      owner = req.user.added;
    } else {
      owner.push(req.user.added);
    }
    let added = [];
    if (req.user.added !== []) {
      added = req.user.added;
    } else {
      added.push(req.user.added);
    }
    console.log(added);
    if (
      !owner.includes(req.params.id.toString()) &&
      !added.includes(req.params.id.toString())
    ) {
      console.log("Test");
      const options = { new: true };

      const quiz = await Model.find({
        userId: { $eq: req.params.id },
      });

      let array = [];
      if (req.user.added !== null) {
        array = req.user.added;
      }
      array.push(req.body.added);
      req.body.added = array;
      const updatedData = req.body;

      const result = await UserModel.findByIdAndUpdate(
        req.user._id,
        updatedData,
        options
      );

      res.send(result);
    } else {
      res.status(400).json("This quiz is already in your private quizlist!");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update by ID Method

router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update OwnerRights

router.patch("/addQuizToOwner", async (req, res) => {
  try {
    const id = req.user._id;
    let array = [];
    if (req.user.owner !== null) {
      array = req.user.owner;
    }
    array.push(req.body.owner);
    req.body.owner = array;
    const updatedData = req.body;

    const options = { new: true };

    const result = await UserModel.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/removeQuizFromOwner", async (req, res) => {
  try {
    const id = req.user._id;
    let array = [];
    if (req.user.owner !== null) {
      array = req.user.owner;
    }
    array = array.filter((item) => item !== req.body.owner);
    req.body.owner = array;
    const updatedData = req.body;
    const options = { new: true };

    const result = await UserModel.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/removeQuizFromAdded", async (req, res) => {
  try {
    const id = req.user._id;
    let array = [];
    if (req.user.added !== null) {
      array = req.user.added;
    }
    array = array.filter((item) => item !== req.body.added);
    req.body.added = array;
    const updatedData = req.body;
    const options = { new: true };

    const result = await UserModel.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method

router.delete("/deleteOne/:id", async (req, res) => {
  try {
    const quiz = await Model.find({
      userId: { $eq: req.params.id },
    });

    const data = await Model.findByIdAndDelete(quiz.id);
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
