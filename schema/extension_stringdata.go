// Code generated by stringdata. DO NOT EDIT.

package schema

// ExtensionSchemaJSON is the content of the file "extension.schema.json".
const ExtensionSchemaJSON = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://sourcegraph.com/v1/extension.schema.json#",
  "title": "Sourcegraph extension",
  "description": "Configuration for a Sourcegraph extension.",
  "type": "object",
  "additionalProperties": false,
  "required": ["platform", "activationEvents"],
  "properties": {
    "title": {
      "description": "The title of the extension. If not specified, the extension ID is used.",
      "type": "string"
    },
    "description": {
      "description": "A description of the extension's features and purpose. Markdown formatting is supported.",
      "type": "string",
      "format": "markdown"
    },
    "platform": {
      "$ref": "#/definitions/ExtensionPlatform"
    },
    "activationEvents": {
      "description":
        "A list of events that cause this extension to be activated. '*' means that it will always be activated.",
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["*"]
      }
    },
    "args": {
      "description":
        "Arguments provided to the extension upon initialization (in the ` + "`" + `initialize` + "`" + ` message's ` + "`" + `initializationOptions` + "`" + ` field).",
      "!go": {
        "pointer": true
      }
    }
  },
  "definitions": {
    "ExtensionPlatform": {
      "description": "The platform targeted by this extension.",
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["docker", "websocket", "tcp", "exec"]
        }
      },
      "oneOf": [
        { "$ref": "#/definitions/DockerTarget" },
        { "$ref": "#/definitions/WebSocketTarget" },
        { "$ref": "#/definitions/TCPTarget" },
        { "$ref": "#/definitions/ExecTarget" }
      ],
      "!go": {
        "taggedUnionType": true
      }
    },
    "DockerTarget": {
      "description": "A specification of how to run a Docker container to provide this extension's functionality.",
      "type": "object",
      "additionalProperties": false,
      "required": ["type", "image"],
      "properties": {
        "type": {
          "type": "string",
          "const": "docker"
        },
        "image": {
          "description": "The Docker image to run.",
          "type": "string"
        }
      }
    },
    "WebSocketTarget": {
      "description": "An existing WebSocket URL endpoint that serves this extension's functionality.",
      "type": "object",
      "additionalProperties": false,
      "required": ["type", "url"],
      "properties": {
        "type": {
          "type": "string",
          "const": "websocket"
        },
        "url": {
          "description": "The WebSocket URL to communicate with.",
          "type": "string",
          "format": "uri",
          "pattern": "^(http|ws)s?://"
        }
      }
    },
    "TCPTarget": {
      "description": "An existing TCP server that serves this extension's functionality.",
      "type": "object",
      "additionalProperties": false,
      "required": ["type", "address"],
      "properties": {
        "type": {
          "type": "string",
          "const": "tcp"
        },
        "address": {
          "description": "The TCP address (` + "`" + `host:port` + "`" + `) of the server to communicate with.",
          "type": "string"
        }
      }
    },
    "ExecTarget": {
      "description":
        "An local executable to run and communicate with over stdin/stdout to provide this extension's functionality.",
      "type": "object",
      "additionalProperties": false,
      "required": ["type", "command"],
      "properties": {
        "type": {
          "type": "string",
          "const": "exec"
        },
        "command": {
          "description": "The path to the executable to run.",
          "type": "string"
        }
      }
    }
  }
}
`