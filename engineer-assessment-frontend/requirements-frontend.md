# Receipt Extractor Frontend

## Description

You are in charge of implementing a small application that automatically extracts information from a receipt image. The application will allow the user to upload an image of a receipt, which will be processed by an AI model to extract key details. The extracted contents will then be saved and returned to the frontend for the user to view.

## Objective

We want to implement a simple frontend application that allows users to upload an image of a receipt, then sends the image to the backend you've created to extract the receipt data. Once the extraction is complete, the frontend should show the results of the extraction that are returned from the endpoint.

## Sample receipt images

The root project includes a `sample-receipts/` [directory](../sample-receipts/) containing a variety of receipt images that you can use for testing purposes during development.

## Requirements

Within the React frontend provided:

1. When the user first lands on the app, they should see the _Landing Page_\
   \
   <img src="./sample-layouts/landing-page.png" alt="Landing page" width="600">\

   a. The landing view should provide a way for the user to select _one_ image to upload\
      _Note: Only accept .jpg, .jpeg, .png file formats_

2. When a valid image has been selected by the user, they should see the _Selected File Preview_\
   \
   <img src="./sample-layouts/selected-file-preview.png" alt="Selected file preview" width="600">\

   a. The user should be able to see the file they have selected, including its name, extension and size

   b. The user should also have the options to either cancel the selected file, or submit it to be extracted

      - IF the user cancels the selected file, return to the _Landing Page_

      - IF the user clicks on the submit button, the image should be passed to the backend to be extracted

3. If the image has been successfully sent to the backend, and the user is waiting for the extraction response, they should see the _Extracting Loader/Progress_\
   \
   <img src="./sample-layouts/extracting-loader-progress.png" alt="Extracting loader/progress" width="600">\

   a. The loader/progress view may be static, have an animation, or incorporate some sort of progress bar

4. IF the backend returns an error or invalid response, the user should be shown an appropriate error message

   a. The user should be able to re-enter the flow starting from the _Landing Page_ - this can be a button or any UI element that allows the user to start a new extraction

5. IF the backend returns a valid response, the user should be shown the _Extraction Results_\
   \
   <img src="./sample-layouts/extraction-results.png" alt="Extraction results" width="600">\

   a. Display the receipt image returned from the backend, along with the extracted details

      1. The following details should be displayed:

         - Date

         - Currency (3-character currency code)

         - Vendor name

         - Receipt items:

           - Item name

           - Item cost

         - GST/tax

         - Total

      2. The receipt _items_ should be scrollable, if the contents are quite long

   b. Provide a way for the user to re-enter the flow starting from the _Landing Page_ - this can be a button or any UI element that allows the user to start a new extraction


## Additional Notes

1. Adhere to any given requirements strictly\
**_Note: The UI shown in the figures above are purely for communicating ideas, and may not perfectly match the written requirements_**

2. For any missing or under-defined requirements, you are free to choose your own approach

3. You are free to add any additional functionality or improvements to the above application that you see fit, so long as the base requirements are present as described above

4. User authentication is out of scope for this assessment

5. You are free to use any unspecified third-party libraries, packages or services

6. You are encouraged to add any UI/UX flair of your own

7. **_This only needs to run locally, but you are free to deploy it (behind simple auth) at your own discretion_**