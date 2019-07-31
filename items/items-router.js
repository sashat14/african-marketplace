const router = require("express").Router();

const Items = require("./items-model.js");
const restricted = require("../auth/middleware/restricted-middleware.js");
const validateItemsContent = require('../auth/middleware/validateItemsContent-middleware')
const verifyItemId = require('../auth/middleware/verifyItemId-middleware.js')


//add Item
router.post("/additem", restricted, validateItemsContent, (req, res) => {
  Items.addItem(req.body)
    .then(item => {
      res.status(201).json(item);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


//Get Items
router.get("/", restricted, (req, res) => {
  Items.getItems()
    .then(items => {
      res.status(200).json(items);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


//Get Users Items
router.get("/:id", verifyItemId, (req, res) => {
  const id = req.params.id;

  Items.getItemsById(id)
    .then(item => {
      res.status(200).json(item);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


//update Users Item
router.put(
  "/:id",
  restricted,
  verifyItemId,
  validateItemsContent,
  (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    Items.updateItem(id, changes)
      .then(updatedItem => {
        res.status(201).json(updatedItem);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
);


//delete users Item
router.delete("/:id", restricted, verifyItemId, (req, res) => {
  const id = req.params.id;

  Items.deleteItem(id)
    .then(deletedItem => {
      res.status(200).json({ message: "Item successfully deleted." });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


// get items by category
router.get('/category', restricted, (req, res) => {
  console.log('req.jwtToken', req.jwtToken)
  const category = req.jwtToken.category
  if (category === null) {
    res.status(400).json({message: "category not valid or missing"})
  } else {
    Items.find(category)
      .then(items => {
        res.json(items);
      })
      .catch(err => res.send(err));
  }
});

module.exports = router;