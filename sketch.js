const Status = (performance, threshold) => (performance >= threshold ? "Passed" : "Not passed");

let CORROSION_MODEL, CONNECTION_MODEL, DAMAGE_MODEL;

let CORROSION_CLASS_NAMES = ["Corroded", "Not Corroded"];
let CONNECTION_CLASS_NAMES = ["Bolted", "Welded"];
let DAMAGE_CLASS_NAMES = ["Damaged", "Not Damaged"];

const imgPreview = document.getElementById("img-preview");
const imageContainer = document.getElementById("image-container");

let imageArray = [];

function preload() {
  CORROSION_MODEL = tf.loadGraphModel("./models/CorrosionModel/model.json");
  CONNECTION_MODEL = tf.loadGraphModel("./models/ConnectionModel/model.json");
  DAMAGE_MODEL = tf.loadGraphModel("./models/DamageModel/model.json");
  console.log("Models ready!");
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
function dropHandler(ev) {
  //console.log("File(s) dropped");
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        //console.log(`… file[${i}].name = ${file.name}`);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      //console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

function dragOverHandler(ev) {
  //console.log("File(s) in drop zone");
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}


function toggleSelectBoxes() {
  var checkbox = document.getElementById("Optional_VisualData");
  var inputsDiv = document.querySelector(".inputs");

  inputsDiv.style.display = checkbox.checked ? "inline-table" : "none";
}

async function getImageData(element) {
  // document.getElementById("loader").style.display = "flex";
  const files = element.files;
  // Reset the arrays when new files are selected
  imageArray = [];
  imageContainer.innerHTML = "";

  if (files.length > 0) {
    // Iterate over selected files
    for (const file of files) {
      const fileReader = new FileReader();

      fileReader.onload = function () {
        const img = new Image();
        img.src = fileReader.result;
        img.style = "height: 100px; width:auto; display: table-row; margin:10px";

        imageArray.push(img);

        // Show images only after all files are loaded
        if (imageArray.length === files.length) {
          imageArray.forEach((img) => {
            imageContainer.appendChild(img);
          });
        }
      };

      fileReader.readAsDataURL(file);
    }
  }
  document.getElementById("submit-images-div").style.display = "flex";
}

let N_Corroded_Images;
let N_Bolted_Images;
let N_Damaged_Images;
let N_Images;

async function classifyImages() {
  N_Corroded_Images = 0;
  N_Bolted_Images = 0;
  N_Damaged_Images = 0;
  N_Images = 0;

  let promises = [];
  for (const img of imageArray) {
    N_Images += 1;
    let corrosionPromise = CORROSION_MODEL.then(
      function (res) {
        let example = tf.browser.fromPixels(img);
        example = tf.image.resizeBilinear(example, [128, 128]).toFloat();
        example = example.reshape([-1, 128, 128, 3]);

        const prediction = res.predict(example).as1D();
        let result = prediction.dataSync()[0];

        if (CORROSION_CLASS_NAMES[int(result > 0.5)] === "Corroded") {
          N_Corroded_Images += 1;
        }
        //console.log('CORROSION | This image most likely belongs to "' + CORROSION_CLASS_NAMES[int(result > 0.5)] + '" | ' + nf(result, 1, 2));
      },
      function (err) {
        console.log(err);
      }
    );

    let connectionPromise = CONNECTION_MODEL.then(
      function (res) {
        let example = tf.browser.fromPixels(img);
        example = tf.image.resizeBilinear(example, [128, 128]).toFloat();
        example = example.reshape([-1, 128, 128, 3]);

        const prediction = res.predict(example).as1D();
        let result = prediction.dataSync()[0];

        if (CONNECTION_CLASS_NAMES[int(result > 0.5)] === "Bolted") {
          N_Bolted_Images += 1;
        }
        //console.log('CONNECTION |This image most likely belongs to "' + CONNECTION_CLASS_NAMES[int(result > 0.5)] + '" | ' + nf(result, 1, 2));
      },
      function (err) {
        console.log(err);
      }
    );

    let damagePromise = DAMAGE_MODEL.then(
      function (res) {
        let example = tf.browser.fromPixels(img);
        example = tf.image.resizeBilinear(example, [128, 128]).toFloat();
        example = example.reshape([-1, 128, 128, 3]);

        const prediction = res.predict(example).as1D();
        let result = prediction.dataSync()[0];

        if (DAMAGE_CLASS_NAMES[int(result > 0.5)] === "Damaged") {
          N_Damaged_Images += 1;
        }
        //console.log('DAMAGE |This image most likely belongs to "' + DAMAGE_CLASS_NAMES[int(result > 0.5)] + '" | ' + nf(result, 1, 2));
      },
      function (err) {
        console.log(err);
      }
    );
    promises.push(corrosionPromise, connectionPromise, damagePromise);
  }
  // Wait for all promises to resolve
  Promise.all(promises).then(function () {
    // Update the Images_Summary after all images are classified
    document.getElementById("Images_Summary").innerText =
      "Depending on the loaded images, " +
      round((N_Corroded_Images / N_Images) * 100, 1) +
      "% is corroded, " +
      round((N_Bolted_Images / N_Images) * 100, 1) +
      "% is bolted, " +
      round((N_Damaged_Images / N_Images) * 100, 1) +
      "% is damaged.";
    // document.getElementById("loader").style.display = "none";
  });
}

function setup() {
  describe("Web application for CNN Tool");
}
function Suggest() {
  document.getElementById("percentages").style.display = "block";

  //-------------------------------------------------

  let Logistic_Performance =
    3 * (1 - parseInt(Item_Weight.value) / 4) +
    3 * parseInt(Easy_Handle.value) +
    4 * parseInt(Exist_Infrastructure.value) +
    1 * parseInt(Special_Protection.value) +
    3 * parseInt(Dismantle_Phase.value) +
    3 * parseInt(Storage_Availability.value);

  //-------------------------------------------------

  let Image_Classification_Performance =
    3 * (N_Bolted_Images / N_Images) +
    4 * (N_Corroded_Images / N_Images) +
    4 * (N_Damaged_Images / N_Images) +
    1 * parseInt(Composite_Connection.value) +
    1 * parseInt(Fire_Protection.value) +
    2 * parseInt(Sufficient_Amount.value) +
    2 * parseInt(Geometry_Check.value);

  //-------------------------------------------------

  let Structural_Performance =
    4 * (parseInt(Data_Quality.value) / 4) +
    2 * parseInt(Construction_Period.value) +
    3 * parseInt(Maintenance.value) +
    3 * parseInt(Purpose.value) +
    3 * parseInt(Testing.value);

  //-------------------------------------------------

  //"According to the cradle-to-cradle life cycle assessment, the embodied carbon at different stage is reported below:"
  //"Total weight of structural element: " + total_weight + " kg"
  //"Product stage A1-A3: " + total_weight * 1.13 + " kgCO2e"

  //"End of life stage C1-C4: " + total_weight * 0.018 + " kgCO2e";
  //"Reuse, recycle and recovery stage D: " + total_weight * -0.413 + " kgCO2e";

  //-------------------------------------------------

  let Logistic_Performance_Percentage = (Logistic_Performance / 17) * 100;
  let Logistic_Performance_Status = Status(Logistic_Performance_Percentage, 75);

  let Image_Classification_Performance_Percentage = (Image_Classification_Performance / 17) * 100;
  let Image_Classification_Performance_Status = Status(Image_Classification_Performance_Percentage, 70);

  let Structural_Performance_Percentage = (Structural_Performance / 15) * 100;
  let Structural_Performance_Status = Status(Structural_Performance_Percentage, 80);

  document.getElementById("Logistic").innerHTML =
    "1) Logistic feasibility: " + round(Logistic_Performance_Percentage, 2) + "% | " + Logistic_Performance_Status;

  document.getElementById("Inspection").innerHTML =
    "2) Structural visual inspection: " + round(Image_Classification_Performance_Percentage, 2) + "% | " + Image_Classification_Performance_Status;

  document.getElementById("Performance").innerHTML =
    "3) Structural performance: " + round(Structural_Performance_Percentage, 2) + "% | " + Structural_Performance_Status;

  if (Image_Classification_Performance_Status == "Passed" && Logistic_Performance_Status == "Passed" && Structural_Performance_Status == "Passed") {
    document.getElementById("Result").innerHTML = " Based on the input evaluation, the efficient end-of-life scenario is: Dismantle - Reuse";
    console.log(
      "The overall reusability analysis shows " +
        ((Structural_Performance / 3 + Image_Classification_Performance / 5 + Logistic_Performance / 3) * 100) / 3 +
        "%"
    );
  } else {
    document.getElementById("Result").innerHTML = "Based on the input evaluation, the efficient end-of-life scenario is: Demolition - Recycle";
  }
}

function draw() {
  noLoop();
}
