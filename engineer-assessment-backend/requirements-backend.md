# Receipt Extractor Backend

## Description

You are in charge of implementing a small application that extracts information from a receipt image. The application will allow the user to upload an image of a receipt, which will be processed by an AI model to extract key details. The extracted contents will then be saved and returned to the frontend for the user to view.

## Objective

We want to implement a new service that utilizes AI to extract details from a provided image of a receipt, and then expose this functionality via an API endpoint to be consumed by our frontend.

## Sample receipt images

The backend repository includes a `sample-receipts/` [directory](../sample-receipts/) containing a variety of receipt images that you can use for testing purposes during development.

## Requirements

Within the NestJS backend provided, you are free to implement any endpoints and backend logic required to fulfill the functional requirements of the frontend. There are, however, some higher-level requirements that _**must**_ be included in the backend:

1. You MUST include the following, at a minimum:

   1. A proper _**database**_ of your choosing, with ORM (no `fs` allowed)
   
   2. Use of a _**storage bucket**_ (e.g. S3 or similar, no `fs` allowed)
   
   3. Use of an _**LLM**_, either through their API or SDK
   
   4. Use of _**function responses**_ or _**formatted responses**_ from the AI model
   
   5. Use of _**in-built NestJS features or a third-party library**_ to validate the extracted data returned by the LLM

2. For the AI receipt extractions:

   1. Extract and return the following information:

      - Date

      - Currency (3-character currency code)

      - Vendor name

      - Receipt items (array):

        - Item name

        - Item cost

      - GST/tax (One GST/tax for the entire receipt)

      - Total

      **_Note: You can choose to use whichever AI model you prefer, via their API or SDK_**
   
   2. Upon receiving the response from the AI model:

      1. Verify the response (shape and type) from the AI model

      2. IF the response is invalid:
      
         1. Return an error

      3. IF the response is valid:

         1. Store the response in the database

         2. Return the extracted data, and image URL, to the frontend

3. Create unit tests for your service that covers the following scenarios:

   a. Successful extraction from valid image

   b. Incorrect file type

   c. Invalid response from AI model (e.g. empty or poorly-formed JSON)

   d. \`500\` status response