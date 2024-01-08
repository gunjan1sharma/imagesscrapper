import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Pagination,
  TextField,
} from "@mui/material";
import DownloadImage from "../assets/images/download.png";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { Image, Root } from "../extras/types";
import SingleComponent from "../components/SingleComponent";
import ImageComponent from "../components/ImageComponent";

const API_BASE_URL = `http://192.168.1.88:9999/extras/v1/api/parsing/image-parser?siteUrl=`;
var static_site_url = "";

function HomePage(props: any) {
  const [videoUrl, setVideoUrl] = useState("");
  const [inVideoUrl, setInVideoUrl] = useState("");
  const [audioResponse, setAudioResponse] = useState<Image[]>();
  const [playVideo, setPlayVideo] = useState(false);
  const [isTermsAggred, setIsTermsAggred] = useState(true);
  const [isDownloadSuccess, setIsDownloadSuccess] = useState(false);
  const [open, setOpen] = React.useState(false);

  const [displayedItems, setDisplayedItems] = useState<Image[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // setIsDownloadSuccess(true);
    // setDisplayedItems(audioResponse.links.slice(0, itemsPerPage));
    return () => {};
  }, []);

  const handlePageChange = (event: any, newPage: any): any => {
    setCurrentPage(newPage);
    setDisplayedItems(
      audioResponse!.slice((newPage - 1) * itemsPerPage, newPage * itemsPerPage)
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): any {
    setVideoUrl(event.target.value);
    if (videoUrl !== "" || videoUrl.includes("youtu")) {
      //setPlayVideo(true);
    } else {
      setPlayVideo(false);
    }
  }

  function mimicDownload() {
    if (!isTermsAggred) {
      alert("Please Agree with our Terms & Condition before procedding..");
      return;
    }

    if (videoUrl === "" || !videoUrl.includes("instagram")) {
      alert("A Valid Facebook Video URL is Required!!");
      return;
    }

    handleOpen();
    //setAudioResponse(sampleResponse.links);
    setIsDownloadSuccess(true);
    setPlayVideo(true);
    setInVideoUrl(videoUrl);
    setTimeout(() => {
      handleClose();
      setVideoUrl("");
    }, 5000);
  }

  function handleCheckboxChange(checked: boolean) {
    setIsTermsAggred(checked);
    //setPlayVideo(checked);
  }

  function fetchDownloadableLink(): void {
    if (!isTermsAggred) {
      alert("Please Agree with our Terms & Condition before procedding..");
      return;
    }

    if (videoUrl === "" || !videoUrl.startsWith("https://www")) {
      alert("A Valid Website URL[https://www] is Required!!");
      return;
    }
    handleOpen();
    axios.post<Root>(API_BASE_URL + videoUrl).then(
      (result) => {
        console.log("Hitting Website Parser  API is successful");
        // setAudioResponse(result.data.images);
        setPlayVideo(true);
        setInVideoUrl(videoUrl);
        if (result.data.images.length === 0) {
          alert(
            "Unable to parse this website due to captcha protected or some other issues..."
          );
          handleClose();
          return;
        }

        setAudioResponse(result.data.images);
        setDisplayedItems(result.data.images.slice(0, itemsPerPage));
        setIsDownloadSuccess(true);
        setTimeout(() => {
          handleClose();
          setVideoUrl("");
        }, 5000);
      },
      (error) => {
        console.log("Something went wrong while hitting data.." + error);
        handleClose();
        alert("Something went wrong while hitting data.. [" + error + " ]");
      }
    );
  }

  function handleVideoPlay(): any {
    if (videoUrl === "" || !videoUrl.startsWith("https://")) {
      alert("A Valid Website URL is Required!!");
      return;
    }
    window.open(videoUrl, "_blank");
  }

  function openLink(audioUrl: string): any {
    if (audioUrl === "" || audioUrl.length < 20) {
      alert("Something went wrong while generating download link, try again..");
      return;
    }
    window.open(audioUrl, "_blank");
  }

  const backdrop = (
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <div className="flex flex-col items-center">
          <CircularProgress color="inherit" />
          <h1 className="font-extrabold m-2 text-white text-xl">
            Communicating with server...
          </h1>
        </div>
      </Backdrop>
    </React.Fragment>
  );

  return (
    <div className="m-10 flex flex-col items-center justify-center">
      {backdrop}
      <div className="flex flex-col items-center border shadow-lg p-4">
        <TextField
          fullWidth
          value={videoUrl}
          onChange={handleChange}
          id="url-input"
          label="Enter Website Link To Scrap"
          variant="outlined"
        />
        <Button
          onClick={fetchDownloadableLink}
          sx={{ marginTop: "20px", marginBottom: "10px", width: "200px" }}
          variant="contained"
        >
          Scrap Image
        </Button>
        <Button
          onClick={handleVideoPlay}
          sx={{ width: "200px", marginTop: "10px", marginBottom: "15px" }}
          variant="outlined"
        >
          Visit Website
        </Button>
        <h3 className="text-xs text-center w-80 m-2">
          A direct list of result will get triggered if video has only one
          format else a list of downloadable video will get presented.
        </h3>
        <div className="flex items-center justify-center">
          <Checkbox
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            defaultChecked
          />
          <h3 className="text-xs text-center m-2">
            By scrapping 3rd party websites you agree to our terms & conditions
            for fair usages policy
          </h3>
        </div>
        <Divider color="black" />
      </div>

      <br />
      <br />
      {isDownloadSuccess && (
        <div className="border-2 text-center border-blue-500 shadow-sm p-4 mb-8">
          <div className="flex flex-col items-center md:flex-row font-mono mb-5 justify-center">
            <h3 className="font-bold text-xl">Image Scrapping Successful</h3>
            <img
              className="m-2"
              width="30px"
              height="30px"
              alt="download"
              src={DownloadImage}
            />
            <img
              className="animate-ping"
              width="30px"
              height="30px"
              alt="download"
              src={DownloadImage}
            />
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-4">
        {isDownloadSuccess &&
          displayedItems!.map((img, index) => {
            return (
              <ImageComponent
                key={index}
                url={inVideoUrl}
                alt={img.alt}
                src={img.src}
              />
            );
          })}
      </div>

      {isDownloadSuccess && (
        <Pagination
          page={currentPage}
          onChange={handlePageChange}
          className="mt-8 border p-3 border-blue-600"
          count={Math.ceil(audioResponse!.length / 10)}
          variant="outlined"
          color="primary"
        />
      )}
    </div>
  );
}

export default HomePage;
