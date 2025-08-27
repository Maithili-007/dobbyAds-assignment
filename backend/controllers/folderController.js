const Folder = require('../models/Folder');
const Image = require('../models/Image');

exports.createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user._id;

    // Build path
    let path = `/${name}`;
    if (parentId) {
      const parentFolder = await Folder.findOne({ _id: parentId, userId });
      if (!parentFolder) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
      path = `${parentFolder.path}/${name}`;
    }

    // Check if folder with same name exists in same parent
    const existingFolder = await Folder.findOne({ 
      name, 
      parentId: parentId || null, 
      userId 
    });

    if (existingFolder) {
      return res.status(400).json({ message: 'Folder with this name already exists' });
    }

    const folder = new Folder({
      name,
      userId,
      parentId: parentId || null,
      path
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { parentId } = req.query;

    const folders = await Folder.find({
      userId,
      parentId: parentId || null
    }).select('_id name path parentId').sort({ name: 1 });

    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    const folders = await Folder.find({ userId }).sort({ path: 1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const folder = await Folder.findOne({ _id: id, userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Check if folder has children
    const childFolders = await Folder.find({ parentId: id, userId });
    const images = await Image.find({ folderId: id, userId });

    if (childFolders.length > 0 || images.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete folder that contains files or subfolders' 
      });
    }

    await Folder.findByIdAndDelete(id);
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
