import Todo from "../models/TodoModel.js";
import path from "path";
import fs from "fs";

export const getTodos = async (req, res) => {
  try {
    const response = await Todo.findAll();
    res.status(200).json(response);
  } catch (e) {
    console.log(e.message);
  }
};

export const getTodosById = async (req, res) => {
  try {
    const response = await Todo.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (e) {
    console.log(e.message);
  }
};

export const createTodos = async (req, res) => {
  console.log(req.body);
  try {
    if (req.files === null)
      return res.status(400).json({ message: "File not found" });

    const title = req.body.title;
    const description = req.body.description;
    const image = req.files.image;
    const fileSize = image.data.length;
    const ext = path.extname(image.name);
    const filename = image.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${filename}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Images must be less than 5 MB" });

    image.mv(`./public/images/${filename}`, async (err) => {
      if (err) return res.status(500).json({ message: err.message });
      try {
        await Todo.create({
          title: title,
          description: description,
          image: filename,
          url: url,
        });
        res.status(201).json({ message: "Todo successfully created" });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const updateTodos = async (req, res) => {
  const todo = await Todo.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!todo) return res.status(404).json({ message: "Data not found" });

  let filename = "";

  if (req.files === null) {
    filename = Todo.image;
  } else {
    const image = req.files.image;
    const fileSize = image.data.length;
    const ext = path.extname(image.name);
    filename = image.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Images must be less than 5 MB" });

    const filepath = `./public/images/${todo.image}`;
    fs.unlinkSync(filepath);

    image.mv(`./public/images/${filename}`, (err) => {
      if (err) return res.status(500).json({ message: err.message });
    });
  }

  const title = req.body.title;
  const description = req.body.description;
  const url = `${req.protocol}://${req.get("host")}/images/${filename}`;
  
  try {
    await Todo.update(
      {
        title: title,
        description: description,
        image: filename,
        url: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message: "Todos updated successfully" });
  } catch (e) {
    console.log(e.message);
  }
};

export const deleteTodos = async (req, res) => {
  const todo = await Todo.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!todo) return res.status(404).json({ message: "Data not found" });

  try {
    const filepath = `./public/images/${todo.image}`;
    fs.unlinkSync(filepath);
    await Todo.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Todos deleted successfully" });
  } catch (e) {
    console.log(e.message);
  }
};
