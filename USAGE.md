# Quick Start Guide

## Installation in n8n

### Option 1: Install via npm (Recommended for production)

1. In your n8n installation, go to **Settings** > **Community Nodes**
2. Click **Install**
3. Enter: `n8n-nodes-synthflow`
4. Click **Install**

### Option 2: Development/Testing

Link this package to your local n8n installation:

```bash
# In this directory
npm link

# In your n8n directory
cd ~/.n8n/custom
npm link n8n-nodes-synthflow

# Restart n8n
```

### Option 3: Docker

Add to your n8n Dockerfile:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-synthflow
```

## Configuration

### Step 1: Get Your Synthflow API Token

1. Log in to your Synthflow account at https://synthflow.ai
2. Navigate to Settings or API section
3. Generate or copy your API token

### Step 2: Add Credentials in n8n

1. In n8n, go to **Credentials** > **New**
2. Search for "Synthflow API"
3. Paste your API token
4. Click **Create**

### Step 3: Create Your First Workflow

1. Create a new workflow in n8n
2. Add a trigger node (e.g., Webhook, Schedule, Manual)
3. Add the **Synthflow** node
4. Select your credentials
5. Configure the parameters:
   - **Model ID**: Your Synthflow agent ID (e.g., `agent_123abc`)
   - **Phone Number**: The number to call (e.g., `+1234567890`)
   - **Recipient Name**: Name of the person (e.g., `John Doe`)
6. (Optional) Add additional fields:
   - Lead Email
   - Lead Timezone (IANA timezone, e.g., `Europe/Berlin`, `America/New_York`)
   - Custom Prompt
   - Custom Greeting
   - Custom Variables (key-value pairs that map to Synthflow Custom Variables for personalization)
   - External Webhook URL (post-call webhook that will receive call status, transcript, and metadata)

## Agent Management

You can also create and manage Synthflow agents directly from n8n using the Synthflow node.

### Create an Agent from n8n

1. Create a new workflow in n8n
2. Add a trigger node (e.g., Manual, Schedule, Webhook)
3. Add the **Synthflow** node
4. Set **Operation** to **Create Agent**
5. Configure the basic agent fields:
   - Agent Type (Outbound, Inbound, Widget)
   - Agent Name
   - Prompt (instructions the agent will follow)
   - Greeting Message (opening line at the start of the call)
   - LLM (e.g., `gpt-4.1-Mini`)
   - Language (e.g., `en`, `de`)
   - Voice ID
6. (Optional) Add additional agent fields:
   - Description
   - Phone Number attached to the agent
   - External Webhook URL (post-call webhook)
   - Inbound Call Webhook URL (inbound call events)
   - Recording and Max Duration options
   - Consent Message and Consent Enabled
   - Agent JSON (raw JSON to merge into the configuration)

### Other Agent Operations

- **Get Agent**: Retrieve a single agent by `model_id`.
- **List Agents**: List agents with `limit` and `offset` for pagination.
- **Update Agent**: Update specific fields using the **Update Fields** collection (type, name, webhooks, recording, max duration, or agent JSON).
- **Delete Agent**: Delete an agent by `model_id`.

## Example Workflows

### Simple Outbound Call

```
Manual Trigger
  ↓
Synthflow (Make a Call)
  Model ID: agent_abc123
  Phone: +1234567890
  Name: John Doe
```

### Call with Custom Variables

```
Webhook Trigger
  ↓
Synthflow (Make a Call)
  Model ID: {{$json["agent_id"]}}
  Phone: {{$json["phone"]}}
  Name: {{$json["name"]}}
  Additional Fields:
    - Lead Email: {{$json["email"]}}
    - Custom Variables:
      - appointment_date: {{$json["date"]}}
      - product_name: {{$json["product"]}}
```

### Batch Calling from Database

```
Schedule Trigger (Daily at 9 AM)
  ↓
MySQL/PostgreSQL (Get Leads)
  ↓
Split In Batches
  ↓
Synthflow (Make a Call)
  Phone: {{$json["phone"]}}
  Name: {{$json["name"]}}
  Custom Variables:
    - lead_id: {{$json["id"]}}
    - company: {{$json["company"]}}
  ↓
Update Database (Mark as Called)
```

## Response Data

The Synthflow node returns the API response which typically includes:

```json
{
  "call_id": "call_123abc",
  "status": "queued",
  "model_id": "agent_abc123",
  "phone": "+1234567890",
  "created_at": "2025-10-14T00:00:00Z"
}
```

You can use this data in subsequent nodes to:
- Log the call in your database
- Send notifications
- Update CRM records
- Track call status

## Troubleshooting

### Node doesn't appear in n8n

1. Restart n8n after installation
2. Check that the package is installed: `npm list n8n-nodes-synthflow`
3. Verify n8n can access community nodes (check settings)

### Authentication Error

1. Verify your API token is correct
2. Check that the token has proper permissions
3. Test the credentials using the "Test" button

### Call not initiated

1. Ensure phone number is in E.164 format (+[country code][number])
2. Verify your Synthflow agent (Model ID) is active
3. Check your Synthflow account has sufficient credits
4. Review error messages in the node execution log

## Support

- **n8n Issues**: https://community.n8n.io/
- **Synthflow Issues**: https://synthflow.ai/support
- **Package Issues**: GitHub repository

## Next Steps

- Explore Synthflow's documentation for advanced agent configuration
- Set up error handling in your workflows
- Create reusable workflow templates
- Monitor call analytics in your Synthflow dashboard

