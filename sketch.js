const Status = (performance, threshold) => (performance >= threshold ? "Passed" : "Not passed");

let CORROSION_MODEL, CONNECTION_MODEL, DAMAGE_MODEL;

let CORROSION_CLASS_NAMES = ["Corroded", "Not Corroded"];
let CONNECTION_CLASS_NAMES = ["Bolted", "Welded"];
let DAMAGE_CLASS_NAMES = ["Damaged", "Not Damaged"];

let imageArray = [];

let N_Corroded_Images;
let N_Bolted_Images;
let N_Damaged_Images;
let N_Images;

function preload() {
  CORROSION_MODEL = tf.loadGraphModel("./models/CorrosionModel/model.json");
  CONNECTION_MODEL = tf.loadGraphModel("./models/ConnectionModel/model.json");
  DAMAGE_MODEL = tf.loadGraphModel("./models/DamageModel/model.json");
  console.log("Models ready!");
}

// Display disclaimer alert on page load
window.onload = () =>
  alert(
    "Disclaimer:\n\nReuST is currently under development and is intended for testing purposes only. As the accuracy and reliability of the results are limited, the provided results should not be used in real-world scenarios. Use the results with caution and always consult with relevant experts for reliable assessments."
  );

let noImageDataCheckbox = document.getElementById("No_Image_Data");
let loadingText = document.getElementById("loading-text");

//// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop ////////////////
function dropHandler(ev) {
  const imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = "";
  imageArray = [];

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  // Use DataTransfer interface to access the file(s)
  [...ev.dataTransfer.files].forEach((file, i) => {
    // Check if the file is an image based on its MIME type
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.style = "height: 200px; width:auto; display: table-row; margin:10px";

        imageArray.push(img);

        // Show images only after all files are loaded
        if (imageArray.length === ev.dataTransfer.files.length) {
          imageArray.forEach((img) => {
            imageContainer.appendChild(img);
          });
          // Enable/disable the "Don't have image files?" checkbox based on whether images are loaded
          noImageDataCheckbox.disabled = imageArray.length > 0 ? true : false;
          loadingText.style.display = imageArray.length > 0 ? "none" : "block";
        }
      };

      reader.readAsDataURL(file);
    } else {
      console.log(`File[${i}] is not an image. Skipping...`);
    }
  });
}

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}
///////////////////////////////////////////////////////////////////////////////

function calculateCarbon() {
  let totalWeight = 0;

  // Check the state of each checkbox and calculate the total weight accordingly
  if (document.getElementById("Element_Weight").checked) {
    let elementWeight = parseFloat(document.getElementById("weight").value) || 0;
    let elementQuantity = parseInt(document.getElementById("items").value) || 0;
    totalWeight = elementWeight * elementQuantity;
  }

  if (document.getElementById("Element_Dim").checked) {
    let elementHeight = parseFloat(document.getElementById("height").value) || 0;
    let elementWidth = parseInt(document.getElementById("width").value) || 0;
    let elementLength = parseFloat(document.getElementById("length").value) || 0;
    let elementUnitWeight = parseInt(document.getElementById("unitWeight").value) || 0;
    let elementQuantity = parseInt(document.getElementById("quantity").value) || 0;
    totalWeight = (((int(elementHeight) / 1000) * int(elementWidth)) / 1000) * int(elementLength) * int(elementUnitWeight) * int(elementQuantity);
  }

  if (document.getElementById("Bulk_Weight").checked) {
    let bulkWeight = parseFloat(document.getElementById("bulk_weight").value) || 0;
    totalWeight = bulkWeight;
  }

  let C_A1A3 = parseFloat(document.getElementById("C_A1-A3").value);
  let C_C1C4 = parseFloat(document.getElementById("C_C1-C4").value);
  let C_D = parseFloat(document.getElementById("C_D").value);

  // Display or use the totalWeight as needed
  if (totalWeight > 0) {
    let resultElement = document.getElementById("LCA_Result");
    resultElement.innerHTML = ""; // Clear previous results

    // According to the cradle-to-cradle life cycle assessment
    resultElement.innerHTML += "<p>Total weight of structural element: <b>" + totalWeight.toFixed(1) + " kg</b></p>";
    resultElement.innerHTML += "<p>Product stage A1-A3: <b>" + (totalWeight * C_A1A3).toFixed(1) + " kgCO<sub>2</sub>e</b></p>";
    resultElement.innerHTML += "<p>End of life stage C1-C4: <b> " + (totalWeight * C_C1C4).toFixed(1) + " kgCO<sub>2</sub>e</b></p>";
    resultElement.innerHTML += "<p>Reuse, recycle and recovery stage D: <b>" + (totalWeight * C_D).toFixed(1) + " kgCO<sub>2</sub>e</b></p>";
  } else {
    alert("Error: Total weight is zero. Please provide valid input values.");
  }
}

async function getImageData(element) {
  // document.getElementById("loader").style.display = "flex";
  const files = element.files;
  // Reset the arrays when new files are selected
  imageArray = [];

  const imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = "";

  if (files.length > 0) {
    // Iterate over selected files
    for (const file of files) {
      const fileReader = new FileReader();

      fileReader.onload = function () {
        const img = new Image();
        img.src = fileReader.result;
        img.style = "height: 200px; width:auto; display: table-row; margin:10px";

        imageArray.push(img);

        // Show images only after all files are loaded
        if (imageArray.length === files.length) {
          imageArray.forEach((img) => {
            imageContainer.appendChild(img);
          });
          // Enable/disable the "Don't have image files?" checkbox based on whether images are loaded
          noImageDataCheckbox.disabled = imageArray.length > 0 ? true : false;
          loadingText.style.display = imageArray.length > 0 ? "none" : "block";
        }
      };

      fileReader.readAsDataURL(file);
    }
  }
}

async function classifyImages() {
  // Display the loader before starting the classification
  document.getElementById("loader").style.display = "inline";
  // Disable the button while the classification is ongoing
  document.getElementById("submit-images").disabled = true;

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
    const sum = document.getElementById("Images_Summary");
    // Update the Images_Summary after all images are classified
    sum.style.display = "block";
    sum.innerText =
      "Depending on the loaded images, " +
      round((N_Corroded_Images / N_Images) * 100, 1) +
      "% is corroded, " +
      round((N_Bolted_Images / N_Images) * 100, 1) +
      "% is bolted, " +
      round((N_Damaged_Images / N_Images) * 100, 1) +
      "% is damaged.";
    // Hide the loader after classification is complete
    document.getElementById("loader").style.display = "none";
    document.getElementById("submit-images").disabled = false;
    Suggest();
  });
}

function setup() {
  describe("Web application for CNN Tool");
}

function Suggest() {
  // Hide all percentage containers initially
  /* document.getElementById("Logistic").style.display = "none";
  document.getElementById("Inspection").style.display = "none";
  document.getElementById("Performance").style.display = "none"; */

  function Structural_Visual_Inspection() {
    let Structural_Visual_Inspection = 0;
    const optdata = document.getElementById("Optional_VisualData");

    let Structural_Visual_Inspection_Percentage = 0;
    if (noImageDataCheckbox.checked) {
      Structural_Visual_Inspection += 3 * parseFloat(Connection_Type_Slider.value) + 4 * parseInt(Corroded.value) + 4 * parseInt(Damaged.value);
    } else {
      Structural_Visual_Inspection += 3 * (N_Bolted_Images / N_Images) + 4 * (N_Corroded_Images / N_Images) + 4 * (N_Damaged_Images / N_Images);
    }

    if (optdata && optdata.checked) {
      Structural_Visual_Inspection +=
        1 * parseInt(Composite_Connection.value) +
        1 * parseInt(Fire_Protection.value) +
        2 * parseInt(Sufficient_Amount.value) +
        2 * parseInt(Geometry_Check.value);
      Structural_Visual_Inspection_Percentage = (Structural_Visual_Inspection / 17) * 100;
    } else {
      Structural_Visual_Inspection_Percentage = (Structural_Visual_Inspection / 11) * 100;
    }

    let Structural_Visual_Inspection_Status = Status(Structural_Visual_Inspection_Percentage, 70);

    return [Structural_Visual_Inspection, Structural_Visual_Inspection_Percentage, Structural_Visual_Inspection_Status];
  }

  function Logistic_Performance() {
    let Logistic_Performance =
      3 * (1 - parseInt(Item_Weight.value) / 4) +
      3 * parseInt(Easy_Handle.value) +
      4 * parseInt(Exist_Infrastructure.value) +
      1 * parseInt(Special_Protection.value) +
      3 * parseInt(Dismantle_Phase.value) +
      3 * parseInt(Storage_Availability.value);

    let Logistic_Performance_Percentage = (Logistic_Performance / 17) * 100;
    let Logistic_Performance_Status = Status(Logistic_Performance_Percentage, 75);

    return [Logistic_Performance, Logistic_Performance_Percentage, Logistic_Performance_Status];
  }

  function Structural_Performance() {
    let Structural_Performance =
      4 * (parseInt(Data_Quality.value) / 4) +
      2 * parseInt(Construction_Period.value) +
      3 * parseInt(Maintenance.value) +
      3 * parseInt(Purpose.value) +
      3 * parseInt(Testing.value);

    let Structural_Performance_Percentage = (Structural_Performance / 15) * 100;
    let Structural_Performance_Status = Status(Structural_Performance_Percentage, 80);

    return [Structural_Performance, Structural_Performance_Percentage, Structural_Performance_Status];
  }

  console.log(Structural_Visual_Inspection());

  let Inspection = document.getElementById("Inspection");
  let Logistic = document.getElementById("Logistic");
  let Performance = document.getElementById("Performance");

  if (imageArray.length > 0 || noImageDataCheckbox.checked) {
    Inspection.style.display = "list-item";
    Inspection.innerHTML =
      "Structural visual inspection: " + round(Structural_Visual_Inspection()[1], 2) + "% | " + Structural_Visual_Inspection()[2];
  }

  // Get all active dropdowns
  const activeSections = document.querySelectorAll(".container.dropdown.active h2");

  // Iterate through all active dropdowns and display corresponding percentage containers
  activeSections.forEach(function (activeSection) {
    const sectionText = activeSection.innerText;
    console.log(sectionText);
    if (sectionText === "Logistic Feasibility (Optional)") {
      //&& (imageArray.length > 0 || noImageDataCheckbox.checked)
      Logistic.style.display = "list-item";
      console.log("aa");
      Logistic.innerHTML = "Logistic feasibility: " + round(Logistic_Performance()[1], 2) + "% | " + Logistic_Performance()[2];
    } else if (sectionText === "Structural Performance (Optional)") {
      Performance.style.display = "list-item";
      Performance.innerHTML = "Structural performance: " + round(Structural_Performance()[1], 2) + "% | " + Structural_Performance()[2];
    }
  });

  /*   document.getElementById("Logistic").innerHTML =
    "1) Logistic feasibility: " + round(Logistic_Performance_Percentage, 2) + "% | " + Logistic_Performance_Status;

  document.getElementById("Inspection").innerHTML =
    "2) Structural visual inspection: " + round(Structural_Visual_Inspection_Percentage, 2) + "% | " + Structural_Visual_Inspection_Status;

  document.getElementById("Performance").innerHTML =
    "3) Structural performance: " + round(Structural_Performance_Percentage, 2) + "% | " + Structural_Performance_Status;
 */

  let Result = document.getElementById("Result");
  let Overall = document.getElementById("Overall");
  if (Structural_Visual_Inspection()[2] == "Passed" && Logistic_Performance()[2] == "Passed" && Structural_Performance()[2] == "Passed") {
    Result.innerHTML = " Dismantle - Reuse";
  } else {
    Result.innerHTML = "Demolition - Recycle";
  }
  Result.style.display = "flex";
  Overall.style.display = "flex";
  Overall.innerHTML =
    "The overall reusability analysis shows " +
    (((Structural_Visual_Inspection()[0] / 5 + Structural_Performance()[0] / 3 + Logistic_Performance()[0] / 3) * 100) / 3).toFixed(2) +
    "%";
  console.log(Result.innerHTML);
}

function draw() {
  noLoop();
}

function showHideElements() {
  let inspectionOption = document.querySelector('input[name="inspection-option"]:checked').value;
  let inspectionElements = document.getElementById("inspection-elements");

  if (inspectionOption === "have-image-files") {
    inspectionElements.style.display = "none";
  } else {
    inspectionElements.style.display = "grid";
  }
}

function toggleOptions(clickedCheckboxId) {
  const checkboxes = ["Element_Weight", "Element_Dim", "Bulk_Weight"];
  let inputsDiv = document.querySelector("#" + clickedCheckboxId + "_Container");
  let checkbox = document.getElementById(clickedCheckboxId);

  // Uncheck other checkboxes and hide their containers
  checkboxes.forEach((checkboxId) => {
    if (checkboxId !== clickedCheckboxId) {
      let otherCheckbox = document.getElementById(checkboxId);
      let otherContainer = document.getElementById(checkboxId + "_Container");
      otherCheckbox.checked = false;
      otherContainer.style.display = "none";
    }
  });

  // Show/hide the clicked checkbox's container
  inputsDiv.style.display = checkbox.checked ? "table" : "none";

  // Handle additional logic for the "No_Image_Data" checkbox
  if (clickedCheckboxId === "No_Image_Data") {
    let optionalVisualDataCheckbox = document.getElementById("Optional_VisualData");
    let optionalVisualDataContainer = document.getElementById("Optional_VisualData_Container");
    let fileInput = document.getElementById("choose-file");
    const imageContainer = document.getElementById("image-container");
    const submitImages = document.getElementById("submit-images");

    if (checkbox.checked) {
      /*       optionalVisualDataCheckbox.checked = true;
      optionalVisualDataContainer.style.display = "table"; 
      fileInput.disabled = true;
      fileInput.style.display = "none";*/
      imageContainer.style.display = "none";
      submitImages.style.display = "none";
    } else {
      /*       optionalVisualDataCheckbox.checked = false;
      optionalVisualDataContainer.style.display = "none"; 
      fileInput.disabled = false;
      fileInput.style.display = "flex";*/
      imageContainer.style.display = "flex";
      submitImages.style.display = "flex";
    }
  }
}

// Slider
document.addEventListener("DOMContentLoaded", function () {
  let slider = document.getElementById("Connection_Type_Slider");
  let sliderLabel = document.getElementById("Slider_Label");

  sliderLabel.innerHTML = slider.value; // Set initial value

  slider.oninput = function () {
    sliderLabel.innerHTML = this.value;
    updateSliderLabelPosition();
  };

  function updateSliderLabelPosition() {
    let percent = (slider.value - slider.min) / (slider.max - slider.min);
    let offset = percent * slider.offsetWidth;
    sliderLabel.style.left = offset + "px";
  }
});

// Toggle Dropdown
document.addEventListener("DOMContentLoaded", function () {
  function toggleDropdown(element) {
    element.parentNode.classList.toggle("active");

    /*     if (element.parentNode.classList.contains("active")) {
      console.log("Dropdown is active:", element.innerText);
    } else {
      console.log("Dropdown is inactive:", element.innerText);
    } */
  }

  // Attach click event listeners to all dropdown headers
  let dropdownHeaders = document.querySelectorAll(".container.dropdown h2");
  dropdownHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      toggleDropdown(this);
    });
  });

  // Attach change event listeners to all select boxes
  let selectBoxes = document.querySelectorAll(".inputs select");
  selectBoxes.forEach(function (selectBox) {
    selectBox.addEventListener("change", function () {
      let container = this.closest(".container");
      container.style.backgroundColor = "rgb(24,65,99)";
    });
  });

  // Attach change event listeners to all text boxes
  let textBoxes = document.querySelectorAll('.inputs input[type="number"]');
  textBoxes.forEach(function (textBoxes) {
    textBoxes.addEventListener("change", function () {
      let container = this.closest(".container");
      container.style.backgroundColor = "rgb(24,65,99)";
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let selectBoxes = document.querySelectorAll(".container select");
  let slider = document.getElementById("Connection_Type_Slider");

  function handleInputChange() {
    Suggest();
  }

  selectBoxes.forEach(function (select) {
    select.addEventListener("change", handleInputChange);
  });

  slider.addEventListener("input", handleInputChange);
});

/* selectBoxes.forEach(function (select) {
  select.addEventListener("change", handleInputChange);
});

slider.addEventListener("input", handleInputChange); */
