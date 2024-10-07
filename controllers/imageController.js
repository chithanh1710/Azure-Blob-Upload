const { BlobServiceClient } = require("@azure/storage-blob");

// Tạo một client để kết nối đến Azure Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

async function postImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const blobName = req.file.originalname; // Lấy tên file
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists(); // Tạo container nếu chưa tồn tại

    // Tạo blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload file lên Azure Blob Storage
    await blockBlobClient.upload(req.file.buffer, req.file.size);

    const blobUrl = blockBlobClient.url; // Lấy URL của blob
    return res
      .status(200)
      .send({ message: "Upload successful!", url: blobUrl });
  } catch (error) {
    console.error("Error uploading to Azure Blob Storage:", error);
    return res.status(500).send("Error uploading file.");
  }
}

async function deleteImage(req, res) {
  try {
    const blobName = req.params.blobName;
    if (!blobName) {
      return res.status(400).send("No blob name provided.");
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();

    return res.status(200).send({ message: "Image deleted successfully!" });
  } catch (error) {
    console.error("Error deleting from Azure Blob Storage:", error);
    return res.status(500).send("Error deleting file.");
  }
}

module.exports = { postImage, deleteImage };
