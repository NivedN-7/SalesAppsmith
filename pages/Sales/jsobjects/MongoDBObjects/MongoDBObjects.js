export default {
	salesStates: [
  {
    "Next": [
      {
        "State": "RFP",
        "Title": "Got an RFP on the lead",
        "Confirmation": [
          "Acknowledged client",
          "Noted commit date",
          "Uploaded information on the lead"
        ],
        "Name": "Lead_RFP"
      },
      {
        "State": "Abandoned",
        "Title": "Abandoning the lead",
        "Confirmation": [
          "Noted why the lead abandoned"
        ],
        "Name": "Lead_Abandoned"
      }
    ],
    "_id": "61dae76a1e48b940b815e952",
    "Name": "Lead"
  },
  {
    "Next": [
      {
        "State": "Proposal",
        "Title": "Sending in the proposal",
        "Confirmation": [
          "Ensure all information needed to work on the proposal is available",
          "Stored all information to prepare the proposal into sales folder",
          "Informed client when they can expect the proposal"
        ],
        "Name": "RFP_Proposal"
      },
      {
        "State": "Nobid",
        "Title": "Deciding not to bid",
        "Confirmation": [
          "An email was sent out explaining why we decided not to bid ",
          "If needed a meeting was held to explain the reason for no bid",
          "Ensured that client will come back for future business even though we did a no bid on this project"
        ],
        "Name": "RFP_Nobid"
      },
      {
        "State": "Abandoned",
        "Title": "Abandoning the sales item",
        "Confirmation": [
          "Noted why the lead abandoned"
        ],
        "Name": "RFP_Abandoned"
      }
    ],
    "_id": "61dae76a1e48b940b815e953",
    "Name": "RFP"
  },
  {
    "Next": [
      {
        "State": "Evaluation",
        "Title": "Moving Proposal to Evaluation",
        "Confirmation": [
          "Proposal was sent to client",
          "A meeting was held to walk through the proposal or a detail email was written explaining the proposal",
          "Do we know if client is asking bid from multiple vendors, if yes capture them as competition for the project"
        ],
        "Name": "Proposal_Evaluation"
      },
      {
        "State": "Abandoned",
        "Title": "Abandoning this Proposal",
        "Confirmation": [
          "Noted Reason for Abandoning"
        ],
        "Name": "Proposal_Abandoned"
      },
      {
        "State": "Rejected",
        "Title": "Proposal Rejected",
        "Confirmation": [
          "Noted Reason for Rejection"
        ],
        "Name": "Proposal_Rejected"
      }
    ],
    "_id": "61dae76a1e48b940b815e954",
    "Name": "Proposal"
  },
  {
    "Next": [
      {
        "State": "Signoff",
        "Title": "Moving Sales into Evaluation Phase",
        "Confirmation": [
          "A thanking email was sent to client",
          "Noted down reasons for winning the sales",
          "Sent out the expected date for quote and/or SOW?"
        ],
        "Name": "Evaluation_Signoff"
      },
      {
        "State": "Rejected",
        "Title": "Sales Rejected at Evaluation Phase",
        "Confirmation": [
          "A thanking email was sent out to client",
          "Noted down reasons for losing the sales in the portal"
        ],
        "Name": "Evaluation_Rejected"
      },
      {
        "State": "Abandoned",
        "Title": "Proposal Abandoned",
        "Confirmation": [
          "A thanking email was sent out to client",
          "Noted down reasons for losing the sales in the portal"
        ],
        "Name": "Evaluation_Abandoned"
      }
    ],
    "_id": "61dae76a1e48b940b815e955",
    "Name": "Evaluation"
  },
  {
    "Next": [
      {
        "State": "Approved",
        "Title": "Moving Sales to Approved",
        "Confirmation": [
          "An estimate was generated and sent out to client",
          "If applicable an SOW was sent out to client"
        ],
        "Name": "Signoff_Approved"
      },
      {
        "State": "Rejected",
        "Title": "Signoff Rejected",
        "Confirmation": [
          "A thanking email was sent to client",
          "Noted down reasons for losing the sales in the portal"
        ],
        "Name": "Signoff_Rejected"
      },
      {
        "State": "Abandoned",
        "Title": "Signoff Abandoned",
        "Confirmation": [
          "A thanking email was sent to client",
          "Noted down reasons for losing the sales in the portal"
        ],
        "Name": "Signoff_Abandoned"
      }
    ],
    "_id": "61dae76a1e48b940b815e956",
    "Name": "Signoff"
  },
  {
    "Next": [],
    "_id": "61dae76a1e48b940b815e957",
    "Name": "Approved"
  },
  {
    "Next": [],
    "_id": "61dae76a1e48b940b815e958",
    "Name": "Rejected"
  },
  {
    "Next": [],
    "_id": "61dae76a1e48b940b815e959",
    "Name": "Nobid"
  },
  {
    "Next": [],
    "_id": "61dae76a1e48b940b815e95a",
    "Name": "Abandoned"
  }
]
}