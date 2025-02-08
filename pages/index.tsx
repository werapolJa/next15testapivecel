import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageData {
  id: string;
  url: string;
  storagePath: string;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [name, setName] = useState<string>("");
  // console.log(name);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get<{ data: ImageData[] }>("/api/getimage");
      setImages(response.data.data);
    } catch (err) {
      console.log("Error fetching images:", err);
    }
  };

  const ProfileImage = ({
    image,
    onImageChange,
    onEdit,
  }: {
    image: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEdit: () => void;
  }) => (
    <div className="relative rounded-full w-32 h-32 md:w-60 md:h-60 bg-gray-200 flex items-center justify-center">
      <Image
        src={image || ""}
        alt="Profile"
        width={240}
        height={240}
        className={`object-cover w-full h-full rounded-full ${
          !image ? "p-12 md:p-0 w-10 h-10 md:w-20 md:h-20 opacity-80" : ""
        }`}
      />
      <button
        className="absolute bottom-1 right-1 md:bottom-1 md:right-1 bg-orange-100 text-white rounded-full p-2 md:p-4 md:w-15 md:h-15"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <div className="w-20 h-20 bg-red-50">x</div>
      </button>
      <button
        className="absolute bottom-1 left-1 md:bottom-1 md:left-1 bg-blue-100 text-white rounded-full p-2 md:p-4 md:w-15 md:h-15"
        onClick={onEdit}
      >
        <div className="w-20 h-20 bg-blue-50">Edit</div>
      </button>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleAddImage = async () => {
    if (!selectedFile) {
      alert("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("/api/pet/uploadyoupet", formData);
      setImage(response.data.urls[0]);
      setSelectedFile(null);
      fetchImages(); // Fetch images again after adding a new one
      console.log(response.data.urls[0]);

      const dataCreate = {
        name: name,
        url: response.data.urls[0],
      };
      await axios.post("/api/pet/createpet", dataCreate);
    } catch (err) {
      console.log("Error uploading image:", err);
    }
  };

  const handleEditImage = () => {
    setEditMode(true);
  };

  const handleSaveEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/pet/uploadyoupet", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(response.data.urls[0]);
      setEditMode(false);
      fetchImages(); // Fetch images again after editing
    } catch (err) {
      console.log("Error uploading image:", err);
    }
  };

  const handleDeleteImage = async (url: string) => {
    try {
      await axios.delete("/api/deleteimage", { data: { url } });
      fetchImages(); // Fetch images again after deleting
    } catch (err) {
      console.log("Error deleting image:", err);
    }
  };
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="max-w-xl mx-auto flex items-center flex-col mt-52">
      <ProfileImage
        image={image}
        onImageChange={handleImageChange}
        onEdit={handleEditImage}
      />
      {editMode && (
        <input
          type="file"
          id="edit-file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleSaveEdit}
        />
      )}
      <input
        type="text"
        name=""
        id=""
        placeholder="Name"
        className="border px-2  py-2 mt-2"
        onChange={handleChangeName}
      />
      {selectedFile && (
        <button
          onClick={handleAddImage}
          className="mt-2 bg-blue-500 text-white py-2 rounded px-20"
        >
          Create
        </button>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Uploaded Images</h2>
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative w-32 h-32 md:w-60 md:h-60 bg-gray-200 flex items-center justify-center"
            >
              <Image
                src={img.url}
                alt={`Uploaded image ${index + 1}`}
                width={240}
                height={240}
                className="object-cover w-full h-full rounded-full"
              />
              <button
                className="absolute top-1 right-1 bg-red-100 text-white rounded-full p-2 md:p-4 md:w-15 md:h-15"
                onClick={() => handleDeleteImage(img.url)}
              >
                <div className="w-20 h-20 bg-red-50">Delete</div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
