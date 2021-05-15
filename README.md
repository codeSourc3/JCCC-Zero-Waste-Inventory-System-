# JCCC-Zero-Waste-Inventory-System-

## Description

This is the Github Repository for the https://jccczerowaste.com/ website. 

## Setup

### Setup Google Sheets

The sheets observed by the server are: "Interns", "Bins", "Tasks", "WeightHistory", "InactiveBins"

The first row of each sheet must have column names. These names are CaSe-SeNsiTive.

The "Interns" sheet has the following column names:

* internId
* firstName
* lastName
* username
* password
* role

The "Bins" sheet has the following column names:

* binId
* binType
* lastBinWeight
* isReturned
* location
* notes

The "Tasks" sheet has the following column names:

* taskId
* binId
* name
* deliveryDate
* location
* notes
* createdOn
* completionStatus
* internId

The "WeightHistory" sheet has the following column names:

* weightId
* binId
* weight
* dateEmptied

The "InactiveBins" sheet has the following column names:

* binId
* binType
* lastBinWeight
* isReturned
* location
* notes


### Setup Service Account

1. Go to [Google Developers Console](https://console.developers.google.com/)
2. Create a project and then select it.
3. Enable the Sheets API
    1. In the sidebar on the left, select **APIs & Services > Library**
    2. Search for "sheets"
    3. Click on "Google Sheets API"
    4. Click the blue "Enable" button
4. Create a service account for your project
    Go to the Google Developers Console and navigate to the API section. You should see a dashboard.
    1. Click on  “Enable APIs” or “Library” which should take you to the library of services that you can connect to. Search and enable the Google Sheets API.
    2. Go to Credentials and select “Create credentials”.
    3. Select “Service Account” and proceed forward by creating this service account. It can be named whatever you want.
    4. Under “Role”, select Project > Owner or Editor, depending on what level of access you want to grant.
    5. Select JSON as the Key Type and click “Create”. This should automatically download a JSON file with your credentials.
    6. Rename this credentials file as client_secret.json and note it's location.
    7. Note the email address of the service account. The email address is also available in your client_secret.json file.
5. Share the Google Spreadsheet with your service account using the email noted above. Select the "Can Edit" option.


