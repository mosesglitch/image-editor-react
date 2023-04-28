import React, { useState } from "react";
import "../styles/sass/index.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { GrRotateLeft, GrRotateRight } from "react-icons/gr";
import { CgMergeVertical, CgMergeHorizontal } from "react-icons/cg";
import { IoMdUndo, IoMdRedo, IoIosImage } from "react-icons/io";
import { ImBrightnessContrast } from "react-icons/im";
import { RiFilmFill } from "react-icons/ri";

import { WiMoonAltThirdQuarter } from "react-icons/wi";
import {
  FaCamera,
  FaImage,
  FaSun,
  FaPalette,
  FaSlidersH,
  FaSyncAlt,
} from "react-icons/fa";
import { BiCrop } from "react-icons/bi";
import storeData from "./LinkedList";
import profilePicToDisplay from "../components/profilePicToDisplay";
import EditProfile from "../routes/EditProfile";

const ServiceImageUpload = ({ image, gender, name, setServiceImageUpload }) => {
  const filterElement = [
    {
      name: "brightness",
      maxValue: 200,
      icon: <ImBrightnessContrast style={{ color: "white" }} />,
    },
    {
      name: "grayscale",
      maxValue: 200,
      icon: (
        <FaSlidersH style={{ filter: "grayscale(100%)", color: "white" }} />
      ),
    },
    {
      name: "sepia",
      maxValue: 200,
      icon: <RiFilmFill style={{ color: "white" }} />,
    },
    {
      name: "saturate",
      maxValue: 200,
      icon: <FaPalette style={{ color: "white" }} />,
    },
    {
      name: "contrast",
      maxValue: 200,
      icon: <WiMoonAltThirdQuarter style={{ color: "white" }} />,
    },
    {
      name: "hueRotate",
      icon: <FaSyncAlt style={{ color: "white" }} />,
    },
  ];
  const [property, setProperty] = useState({
    name: "brightness",
    maxValue: 200,
  });
  const [details, setDetails] = useState("");
  const [edit, setEdit] = useState(false);
  const [crop, setCrop] = useState("");
  const [caption, setCaption] = useState("");
  const [state, setState] = useState({
    image: "",
    brightness: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    contrast: 100,
    hueRotate: 0,
    rotate: 0,
    vartical: 1,
    horizental: 1,
  });
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  console.log(caption);
  const leftRotate = () => {
    setState({
      ...state,
      rotate: state.rotate - 90,
    });

    const stateData = state;
    stateData.rotate = state.rotate - 90;
    storeData.insert(stateData);
  };

  const rightRotate = () => {
    setState({
      ...state,
      rotate: state.rotate + 90,
    });
    const stateData = state;
    stateData.rotate = state.rotate + 90;
    storeData.insert(stateData);
  };
  const varticalFlip = () => {
    setState({
      ...state,
      vartical: state.vartical === 1 ? -1 : 1,
    });
    const stateData = state;
    stateData.vartical = state.vartical === 1 ? -1 : 1;
    storeData.insert(stateData);
  };

  const horizentalFlip = () => {
    setState({
      ...state,
      horizental: state.horizental === 1 ? -1 : 1,
    });
    const stateData = state;
    stateData.horizental = state.horizental === 1 ? -1 : 1;
    storeData.insert(stateData);
  };

  const redo = () => {
    const data = storeData.redoEdit();
    if (data) {
      setState(data);
    }
  };
  const undo = () => {
    const data = storeData.undoEdit();
    if (data) {
      setState(data);
    }
  };
  const imageHandle = (e) => {
    if (e.target.files.length !== 0) {
      const reader = new FileReader();

      reader.onload = () => {
        setState({
          ...state,
          image: reader.result,
        });

        const stateData = {
          image: reader.result,
          brightness: 100,
          grayscale: 0,
          sepia: 0,
          saturate: 100,
          contrast: 100,
          hueRotate: 0,
          rotate: 0,
          vartical: 1,
          horizental: 1,
        };
        storeData.insert(stateData);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const imageCrop = () => {
    const canvas = document.createElement("canvas");
    const scaleX = details.naturalWidth / details.width;
    const scaleY = details.naturalHeight / details.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      details,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Url = canvas.toDataURL("image/jpg");

    setState({
      ...state,
      image: base64Url,
    });
  };
  const saveImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = details.naturalHeight;
    canvas.height = details.naturalHeight;
    const ctx = canvas.getContext("2d");

    ctx.filter = `brightness(${state.brightness}%) brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((state.rotate * Math.PI) / 180);
    ctx.scale(state.vartical, state.horizental);

    ctx.drawImage(
      details,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    const link = document.createElement("a");
    link.download = "image_edit.jpg";
    link.href = canvas.toDataURL();
    link.click();
    console.log(link.href);
  };
  return (
    <div className="image_editor">
      <div className="card">
        <div className="image_section">
          <div className="image">
            <div
              className="close-modal"
              onClick={() => setServiceImageUpload(false)}
            >
              x
            </div>
            {state.image ? (
              <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                <img
                  onLoad={(e) => setDetails(e.currentTarget)}
                  style={{
                    filter: `brightness(${state.brightness}%) brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`,
                    transform: `rotate(${state.rotate}deg) scale(${state.vartical},${state.horizental})`,
                  }}
                  src={state.image}
                  alt=""
                />
              </ReactCrop>
            ) : (
              <label htmlFor="choose">
                <IoIosImage />
                <span>Choose Image</span>
                {/* <label htmlFor="choose">Choose Image</label> */}
                <input
                  style={{ visibility: "hidden" }}
                  onChange={imageHandle}
                  type="file"
                  id="choose"
                />
              </label>
            )}
          </div>
          {!edit && (
            <div className="image_caption text-white">
              <div className="my-1">
                <img
                  src={profilePicToDisplay(image, gender)}
                  alt=""
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#EAECEE",
                  }}
                  className="rounded-circle mr-2"
                />
                <label className="justify-self-end" for="my-textarea">
                  Linda Jeffrey
                </label>
              </div>
              <textarea
                id="my-textarea"
                rows="3"
                placeholder="add a caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
              <div className="d-flex justify-content-around">
                <button className="flex-start" onClick={() => setEdit(true)}>
                  Edit
                </button>
                <button className="flex-end" onClick={saveImage}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
        {edit && (
          <div className="edit">
            <div className="filter_section">
              <div className="image_select">
                {/* <div className="reset">
              <button>Reset</button>
            </div> */}

                <label htmlFor="choose" onClick={() => setEdit(false)}>
                  save
                </label>
                {/* <input onChange={imageHandle} type="file" id="choose" /> */}
              </div>
              {/* <span>Filters</span> */}

              <div className="rotate">
                {/* <label htmlFor="">Rotate & Filp</label> */}
                <div className="icon">
                  <div onClick={leftRotate}>
                    <GrRotateLeft color="white" size={25} />
                  </div>
                  <div onClick={rightRotate}>
                    <GrRotateRight color="white" size={25} />
                  </div>
                  <div onClick={varticalFlip}>
                    <CgMergeVertical color="white" size={25} />
                  </div>
                  <div onClick={horizentalFlip}>
                    <CgMergeHorizontal color="white" size={25} />
                  </div>
                  {crop && (
                    <div onClick={imageCrop} className="crop">
                      <BiCrop color="white" size={25} />
                    </div>
                  )}
                  <button onClick={undo} className="undo">
                    <IoMdUndo />
                  </button>
                  <button onClick={redo} className="redo">
                    <IoMdRedo />
                  </button>
                </div>
              </div>
              <div className="filter_key">
                {filterElement.map((v, i) => {
                  return (
                    <button
                      className={property.name === v.name ? "active" : ""}
                      onClick={() => setProperty(v)}
                      key={i}
                    >
                      {v.icon}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="filter_slider">
              <div className="label_bar">
                <span className="text-white" htmlFor="range">
                  {property.name}
                </span>
                <span className="text-white">100%</span>
              </div>
              <input
                name={property.name}
                onChange={inputHandle}
                value={state[property.name]}
                max={property.maxValue}
                type="range"
              />
            </div>
          </div>
        )}
        {/* <div className="reset">
          <button onClick={saveImage} className="save">
            Save Image
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ServiceImageUpload;
