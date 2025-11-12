# n8n-nodes-synthflow

This is an n8n community node that lets you use [Synthflow AI](https://synthflow.ai/) in your n8n workflows.

Synthflow AI enables you to create AI-powered voice agents that can make outbound calls automatically.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-synthflow` in **Enter npm package name**
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes
5. Select **Install**

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

### Manual Installation

To get started install the package in your n8n root directory:

```bash
npm install n8n-nodes-synthflow
```

For Docker-based deployments add the following line before the font installation command in your [n8n Dockerfile](https://github.com/n8n-io/n8n/blob/master/docker/images/n8n/Dockerfile):

```
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-synthflow
```

## Operations

### Make a Call

Initiates an outbound phone call using a Synthflow AI agent.

**Required Parameters:**
- **Model ID**: The ID of your Synthflow AI agent
- **Phone Number**: Recipient's phone number in E.164 format (e.g., +1234567890)
- **Recipient Name**: Name of the person being called

**Optional Parameters:**
- **Lead Email**: Customer's email for appointment booking
- **Lead Timezone**: Customer's timezone (e.g., "Europe/Berlin")
- **Prompt**: Custom prompt to override the agent's default behavior
- **Greeting**: Custom greeting message for when the call is answered
- **Custom Variables**: Key-value pairs that can be dynamically injected into your agent's prompt

## Credentials

To use this node, you need a Synthflow API account and an API token.

1. Sign up for a [Synthflow account](https://synthflow.ai/)
2. Navigate to your account settings to generate an API token
3. In n8n, create new credentials of type "Synthflow API"
4. Paste your API token into the credentials

## Compatibility

This node has been tested with:
- n8n version: 1.0.0+
- Node.js version: 18.x, 20.x

## Usage

### Basic Example

1. Add the Synthflow node to your workflow
2. Connect your Synthflow API credentials
3. Select "Make a Call" operation
4. Enter your agent's Model ID
5. Provide the phone number and recipient name
6. Configure any optional parameters as needed
7. Execute the workflow

### Example Workflow

**Automated Sales Calls:**
```
Trigger (Webhook/Schedule)
  ↓
Get Leads from Database
  ↓
Synthflow Node (Make Call)
  - Model ID: your_agent_id
  - Phone: {{$json["phone"]}}
  - Name: {{$json["name"]}}
  - Custom Variables:
    - product: {{$json["product_name"]}}
    - price: {{$json["price"]}}
  ↓
Log Results
```

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Synthflow API Documentation](https://docs.synthflow.ai/)
* [Synthflow Website](https://synthflow.ai/)

## Version History

### 0.1.0
- Initial release
- Support for "Make a Call" endpoint
- Full parameter support including custom variables

## Development

### Build

```bash
npm run build
```

### Watch for Changes

```bash
npm run dev
```

### Linting

```bash
npm run lint
npm run lintfix
```

### Testing

Test the node by installing it in your n8n instance:

```bash
# Link the package
npm link

# In your n8n installation directory
npm link n8n-nodes-synthflow

# Restart n8n
```

## License

[MIT](LICENSE.md)

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/yourusername/n8n-nodes-synthflow).

For Synthflow-specific questions, contact [Synthflow support](https://synthflow.ai/support).

