{
    const image = new Image(),
        takePhotoButton = document.querySelector(".takePhoto");
    
    let imageCapture;

    // Puzzle Variables
    const markers = document.querySelectorAll("a-marker"),
        numCol = 3, numRow = 3,
        puzzlePieces = numCol * numRow,
        tolerance = 1.9;

    let imgPieces = new Array(puzzlePieces),
        puzzle = [...Array(puzzlePieces).keys()].map(String),
        pieces = numCol * numRow - 1
        positionMarkers = [],
        check = new Array(6);


    const init = () => {
        video = document.querySelector("video");
        navigator.mediaDevices.enumerateDevices()
            .catch(error => console.log("enumerateDevices() error", error))
            .then(getStream);

        takePhotoButton.addEventListener("click", getPicture);
    };

    // Get a video stream from the camera
    const getStream = () => {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(mediaStream => {
            //Display the stream from the camera, and then 
            document.querySelector('video').srcObject = mediaStream;
            //create an ImageCapture object, using video from the stream
            const track = mediaStream.getVideoTracks()[0];
            imageCapture = new ImageCapture(track);
            })
            .catch(error => {
            console.log('getUserMedia error', error);
            });
    }


    // take the picture
    const getPicture = () => {

        shuffle(puzzle);
        imageCapture.takePhoto()
            .then((img) => {
                image.src = URL.createObjectURL(img);
                image.addEventListener("load", () => createImagePieces(image));
                setInterval(() => checkDistance(), 1000);
                console.log(puzzle);
            })
            .catch((error) => {console.log("takePhoto() error", error)});

    };

    const createImagePieces = image => {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const pieceWidth = image.width / numCol;
        const pieceHeight = image.height / numRow;


        for (let x = 0; x < numCol; ++x) {
            for (let y = 0; y < numRow; ++y) {
                ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                // ctx.drawImage(image, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, canvas.width, canvas.height);
                imgPieces[8 - pieces] = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                pieces = pieces - 3;

                if (pieces < 0) {
                    pices = (puzzlePieces - 1) + pieces;
                }
            }
        }
    };

        markers.forEach((marker, i) => {
            const aImg = document.createElement("a-image");

            aImg.setAttribute("rotation", "-90 0 0");
            aImg.setAttribute("position", "0 0 0");
            aImg.setAttribute("src", imgPieces[puzzle[i]]);

            marker.appendChild(aImg);
        })

}


const shuffle = randomArray => {
    for(let i=randomArray.length - 1; i > 0; i--) {
        // random from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // swap
        // let t = randomArray[i];
        // randomArray[i] = randomArray[j];
        // randomArray[j] = t;

        // or swap like this
        [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]]
    }
    return randomArray;
}