define({ "api": [
  {
    "type": "get",
    "url": "/m/appointment",
    "title": "Confirm an Appointment",
    "name": "confirm",
    "group": "Appointment",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fname",
            "description": "<p>Firstname of the User.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lname",
            "description": "<p>Lastname of the User.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of birth of the User.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/m/appointment?fname=John&lname=\"Doe\"&dob=\"05/13/1965",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fname",
            "description": "<p>Firstname of the User.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request (example):",
          "content": "HTTP/1.1 200 OK\n{\n \"appointment\": [\n    \"appointmentObject\"\n ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/appointment/index.js",
    "groupTitle": "Appointment"
  },
  {
    "type": "put",
    "url": "/m/appointment/:id/state/next",
    "title": "Transition to Next State",
    "name": "controller_nextState",
    "group": "Appointment",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/appointment/index.js",
    "groupTitle": "Appointment"
  },
  {
    "type": "put",
    "url": "/m/appointment/:id/state",
    "title": "Set a Specific State",
    "name": "controller_updateState",
    "group": "Appointment",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/appointment/index.js",
    "groupTitle": "Appointment"
  },
  {
    "type": "get",
    "url": "/m/appointment/:id",
    "title": "Get Appointment Info",
    "version": "0.6.0",
    "name": "retrieve",
    "group": "Appointment",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Appointment id</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "http://localhost/api/m/appointment/123456789",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fname",
            "description": "<p>Firstname of the User.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (example):",
          "content": "HTTP/1.1 200 OK\n{\n \"appointment\": [\n    \"appointmentObject\"\n ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/appointment/index.js",
    "groupTitle": "Appointment"
  },
  {
    "type": "post",
    "url": "/authTest/",
    "title": "Test Your Authentication",
    "name": "authTest",
    "group": "Authentication",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "api_token",
            "description": "<p>The api token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authentication\": \"Token WW9sbzp5b2xv\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/authTest -H \"Authorization: Token WW9sbzp5b2xv\"",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Request (example):",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/auth/index.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/auth/",
    "title": "Get Authenticated",
    "name": "postAuth",
    "group": "Authentication",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authentication",
            "description": "<p>The api token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authentication\": \"Token WW9sbzp5b2xv\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/authTest -H \"Authorization: Token WW9sbzp5b2xv\"",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 200 OK\n    {\n      \"api_token\": \"WW9sbzp5b2xv\"\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/auth/index.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/m/form/:id",
    "title": "Create a form",
    "name": "controller_createForm",
    "group": "Form",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id for a form.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"answers\": [\n   {\n     \"label\": \"Name\",\n     \"response\": \"John Doe\"\n   },\n   {\n     \"label\": \"Gender\",\n     \"response\": \"Female\"\n   },\n   {\n     \"label\": \"Email\",\n     \"response\": \"john.doe@example.com\"\n   },\n   {\n     \"label\": \"Favorite Color\",\n     \"response\": \"Blue\"\n   }\n ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/form/index.js",
    "groupTitle": "Form"
  },
  {
    "type": "post",
    "url": "/m/form/",
    "title": "Create a form response",
    "name": "controller_createResponse",
    "group": "Form",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/form/index.js",
    "groupTitle": "Form"
  },
  {
    "type": "get",
    "url": "/m/form/:id",
    "title": "Get a form",
    "name": "controller_show",
    "group": "Form",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/m/form/:id",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id for a form.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response (example):",
          "content": "HTTP/1.1 200 OK\n{\n    business: 1293182391203,\n    fields: [ {\n        type: \"textfield\",\n        label: \"Name\"\n},\n{\n        type: \"dropdown\",\n        label: \"Gender\",\n        options: [\"Male\", \"Female\"]\n},\n{\n        type: \"textfield\",\n        label: \"Email\"\n},\n{\n        type: \"dropdown\",\n        label: \"Favorite Color\",\n        options: [\"Blue\", \"Yellow\", \"Green\", \"Pink\"]\n}]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/form/index.js",
    "groupTitle": "Form"
  },
  {
    "type": "delete",
    "url": "/m/appointment/:id",
    "title": "Delete A Mobile Token",
    "name": "DeleteToken",
    "group": "MobileToken",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id for mobileToken.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE -i http://localhost/api/m/mobileToken/:id",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response (example):",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/mobiletoken/index.js",
    "groupTitle": "MobileToken"
  },
  {
    "type": "get",
    "url": "/m/appointment/",
    "title": "Get A Mobile Token",
    "name": "GetToken",
    "group": "MobileToken",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/m/mobileToken/",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response (example):",
          "content": "HTTP/1.1 204 No Content\n{\n    business : 121231239082103,\n    employee : 123131231409844,\n    name : \"Device Name\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/mobiletoken/index.js",
    "groupTitle": "MobileToken"
  }
] });