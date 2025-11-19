import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Synthflow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Synthflow',
		name: 'synthflow',
		icon: 'file:synthflow.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Synthflow AI API',
		defaults: {
			name: 'Synthflow',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'synthflowApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.synthflow.ai',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Agent',
						value: 'createAgent',
						description: 'Create a new Synthflow voice agent (outbound, inbound, or widget)',
						action: 'Create an agent',
					},
					{
						name: 'Delete Agent',
						value: 'deleteAgent',
						description: 'Delete a Synthflow agent',
						action: 'Delete an agent',
					},
					{
						name: 'Get Agent',
						value: 'getAgent',
						description: 'Retrieve a single Synthflow agent by model ID',
						action: 'Get an agent',
					},
					{
						name: 'List Agents',
						value: 'listAgents',
						description: 'List Synthflow agents in your workspace',
						action: 'List agents',
					},
					{
						name: 'Make a Call',
						value: 'makeCall',
						description: 'Initiate an outbound phone call using a Synthflow AI agent',
						action: 'Make a call',
					},
					{
						name: 'Update Agent',
						value: 'updateAgent',
						description: 'Update an existing Synthflow agent configuration',
						action: 'Update an agent',
					},
				],
				default: 'makeCall',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'agent_123abc',
				description: 'The ID of the Synthflow AI agent to use for the call',
				displayOptions: {
					show: {
						operation: ['makeCall'],
					},
				},
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				default: '',
				required: true,
				placeholder: '+1234567890',
				description: 'The recipient\'s phone number in E.164 format',
				displayOptions: {
					show: {
						operation: ['makeCall'],
					},
				},
			},
			{
				displayName: 'Recipient Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'John Doe',
				description: 'The name of the call recipient',
				displayOptions: {
					show: {
						operation: ['makeCall'],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['makeCall'],
					},
				},
				options: [
					{
						displayName: 'Custom Variables',
						name: 'custom_variables',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'Add Variable',
						default: {},
						description: 'Key-value pairs to dynamically inject into the prompt',
						options: [
							{
								name: 'variables',
								displayName: 'Variables',
								values: [
									{
										displayName: 'Key',
										name: 'key',
										type: 'string',
										default: '',
										description: 'Variable name',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Variable value',
									},
								],
							},
						],
					},
					{
						displayName: 'External Webhook URL',
						name: 'external_webhook_url',
						type: 'string',
						default: '',
						description:
							'Post-call webhook URL that will receive call data such as status, transcript, and metadata',
					},
					{
						displayName: 'Greeting',
						name: 'greeting',
						type: 'string',
						default: '',
						placeholder: 'Hello, this is AI assistant calling...',
						description: 'Custom greeting the agent will use when the call is answered',
					},
					{
						displayName: 'Lead Email',
						name: 'lead_email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'The customer\'s email that can be used to book an appointment',
					},
					{
						displayName: 'Lead Timezone',
						name: 'lead_timezone',
						type: 'string',
						placeholder: 'Europe/Berlin',
						default: '',
						description:
							'The customer\'s time zone in IANA format (for example, Europe/Berlin, America/New_York)',
					},
					{
						displayName: 'Prompt',
						name: 'prompt',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Custom prompt for the AI agent to use during the call',
					},
				],
			},
			{
				displayName: 'Agent Type',
				name: 'agentType',
				type: 'options',
				default: 'outbound',
				description: 'The type of the agent to create',
				displayOptions: {
					show: {
						operation: ['createAgent'],
					},
				},
				options: [
					{
						name: 'Outbound',
						value: 'outbound',
					},
					{
						name: 'Inbound',
						value: 'inbound',
					},
					{
						name: 'Widget',
						value: 'widget',
					},
				],
			},
			{
				displayName: 'Agent Name',
				name: 'agentName',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'Synthflow Customer Service',
				description: 'Name of the agent',
				displayOptions: {
					show: {
						operation: ['createAgent'],
					},
				},
			},
			{
				displayName: 'Prompt',
				name: 'agent_prompt',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				description: 'Prompt the agent will use during conversations',
				displayOptions: {
					show: {
						operation: ['createAgent'],
					},
				},
			},
			{
				displayName: 'Greeting Message',
				name: 'agent_greeting_message',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				required: true,
				description: 'Greeting message the agent will use at the start of the conversation',
				displayOptions: {
					show: {
						operation: ['createAgent'],
					},
				},
			},
			{
				displayName: 'LLM',
				name: 'agent_llm',
				type: 'string',
				default: '',
				required: true,
				description: 'Language model identifier (for example, gpt-5.1 or gpt-5)',
				displayOptions: {
					show: {
						operation: ['createAgent'],
					},
				},
			},
			{
				displayName: 'Language',
				name: 'agent_language',
				type: 'string',
				default: '',
				required: true,
				description: 'Language code the agent should use (for example, en, de)',
				displayOptions: {
					show: {
						operation: ['createAgent'],
					},
				},
			},
			{
				displayName: 'Voice ID',
				name: 'agent_voice_id',
				type: 'string',
				default: '',
				required: true,
				description: 'Identifier of the voice the agent will use',
				displayOptions: {
					show: {
						operation: ['createAgent'],
					},
				},
			},
			{
				displayName: 'Additional Agent Fields',
				name: 'additionalAgentFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['createAgent'],
					},
				},
				options: [
					{
						displayName: 'Agent JSON',
						name: 'agentJson',
						type: 'string',
						typeOptions: {
							rows: 6,
						},
						default: '',
						description:
							'Raw JSON for the agent object. If set, it will be merged into the generated agent configuration.',
					},
					{
						displayName: 'Consent Message',
						name: 'consent_message',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						description:
							'Message the agent will say to ask the customer for consent to record the call',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						description: 'Description of the agent',
					},
					{
						displayName: 'External Webhook URL',
						name: 'external_webhook_url',
						type: 'string',
						default: '',
						description:
							'Post-call webhook URL that will receive call data such as status, transcript, and metadata',
					},
					{
						displayName: 'Inbound Call Webhook URL',
						name: 'inbound_call_webhook_url',
						type: 'string',
						default: '',
						description:
							'Webhook URL that will receive inbound call events for this agent',
					},
					{
						displayName: 'Is Consent Enabled',
						name: 'is_consent_enabled',
						type: 'boolean',
						default: false,
						description:
							'Whether the agent should ask the customer for consent to record the call',
					},
					{
						displayName: 'Is Recording Enabled',
						name: 'is_recording',
						type: 'boolean',
						default: false,
						description: 'Whether call recording should be enabled for this agent',
					},
					{
						displayName: 'Max Duration (Seconds)',
						name: 'max_duration_duration_seconds',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 0,
						description: 'Maximum call length in seconds before the agent automatically ends the call',
					},
					{
						displayName: 'Max Duration Enabled',
						name: 'max_duration_is_enabled',
						type: 'boolean',
						default: false,
						description: 'Whether a maximum call length limit is enabled',
					},
					{
						displayName: 'Phone Number',
						name: 'phone_number',
						type: 'string',
						default: '',
						placeholder: '+18284265151',
						description: 'Phone number attached to the agent for inbound or outbound calls',
					},
				],
			},
			{
				displayName: 'Agent Model ID',
				name: 'agentModelId',
				type: 'string',
				default: '',
				required: true,
				description: 'The ID of the agent (model_id)',
				placeholder: '4ba429e6-dc96-4c0b-966f-9bdf689ccfa6',
				displayOptions: {
					show: {
						operation: ['getAgent', 'updateAgent', 'deleteAgent'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
				displayOptions: {
					show: {
						operation: ['listAgents'],
					},
				},
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Index of the first agent to be returned',
				displayOptions: {
					show: {
						operation: ['listAgents'],
					},
				},
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['updateAgent'],
					},
				},
				options: [
					{
						displayName: 'Agent JSON',
						name: 'agentJson',
						type: 'string',
						typeOptions: {
							rows: 6,
						},
						default: '',
						description:
							'Raw JSON for the agent object. If set, it will replace any existing agent configuration in the update body.',
					},
					{
						displayName: 'Agent Name',
						name: 'agentName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Agent Type',
						name: 'agentType',
						type: 'options',
						default: 'outbound',
						options: [
							{
								name: 'Outbound',
								value: 'outbound',
							},
							{
								name: 'Inbound',
								value: 'inbound',
							},
							{
								name: 'Widget',
								value: 'widget',
							},
						],
					},

				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'makeCall') {
					const modelId = this.getNodeParameter('modelId', i) as string;
					const phone = this.getNodeParameter('phone', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as any;

					const body: any = {
						model_id: modelId,
						phone,
						name,
					};

					if (additionalFields.lead_email) {
						body.lead_email = additionalFields.lead_email;
					}

					if (additionalFields.lead_timezone) {
						body.lead_timezone = additionalFields.lead_timezone;
					}

					if (additionalFields.external_webhook_url) {
						body.external_webhook_url = additionalFields.external_webhook_url;
					}

					if (additionalFields.prompt) {
						body.prompt = additionalFields.prompt;
					}

					if (additionalFields.greeting) {
						body.greeting = additionalFields.greeting;
					}

					if (additionalFields.custom_variables?.variables?.length) {
						body.custom_variables = additionalFields.custom_variables.variables
							.filter((variable: any) => variable.key && variable.value)
							.reduce((acc: any, variable: any) => {
								acc[variable.key] = variable.value;
								return acc;
							}, {});
					}

					const responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'synthflowApi',
						{
							method: 'POST',
							url: 'https://api.synthflow.ai/v2/calls',
							body,
							json: true,
						},
					);

					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData as any),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				} else if (operation === 'createAgent') {
					const agentType = this.getNodeParameter('agentType', i) as string;
					const agentName = this.getNodeParameter('agentName', i) as string;
					const prompt = this.getNodeParameter('agent_prompt', i) as string;
					const greetingMessage = this.getNodeParameter('agent_greeting_message', i) as string;
					const llm = this.getNodeParameter('agent_llm', i) as string;
					const language = this.getNodeParameter('agent_language', i) as string;
					const voiceId = this.getNodeParameter('agent_voice_id', i) as string;
					const additionalAgentFields = this.getNodeParameter('additionalAgentFields', i, {}) as any;

					const agent: any = {
						prompt,
						greeting_message: greetingMessage,
						llm,
						language,
						voice_id: voiceId,
					};

					if (additionalAgentFields.agentJson) {
						let parsedAgent: unknown;
						try {
							parsedAgent = JSON.parse(additionalAgentFields.agentJson as string);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in Agent JSON field', {
								itemIndex: i,
							});
						}

						if (typeof parsedAgent !== 'object' || parsedAgent === null) {
							throw new NodeOperationError(
								this.getNode(),
								'Agent JSON must be a JSON object',
								{
									itemIndex: i,
								},
							);
						}

						Object.assign(agent, parsedAgent as object);
					}

					const body: any = {
						type: agentType,
						name: agentName,
						agent,
					};

					if (additionalAgentFields.description) {
						body.description = additionalAgentFields.description;
					}

					if (additionalAgentFields.phone_number) {
						body.phone_number = additionalAgentFields.phone_number;
					}

					if (additionalAgentFields.external_webhook_url) {
						body.external_webhook_url = additionalAgentFields.external_webhook_url;
					}

					if (additionalAgentFields.inbound_call_webhook_url) {
						body.inbound_call_webhook_url = additionalAgentFields.inbound_call_webhook_url;
					}

					if (typeof additionalAgentFields.is_recording === 'boolean') {
						body.is_recording = additionalAgentFields.is_recording;
					}

					if (
						typeof additionalAgentFields.max_duration_duration_seconds === 'number' &&
						additionalAgentFields.max_duration_duration_seconds > 0
					) {
						body.max_duration = body.max_duration || {};
						body.max_duration.duration_seconds = additionalAgentFields.max_duration_duration_seconds;
					}

					if (typeof additionalAgentFields.max_duration_is_enabled === 'boolean') {
						body.max_duration = body.max_duration || {};
						body.max_duration.is_enabled = additionalAgentFields.max_duration_is_enabled;
					}

					if (additionalAgentFields.consent_message) {
						body.agent.consent_message = additionalAgentFields.consent_message;
					}

					if (typeof additionalAgentFields.is_consent_enabled === 'boolean') {
						body.agent.is_consent_enabled = additionalAgentFields.is_consent_enabled;
					}

					const responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'synthflowApi',
						{
							method: 'POST',
							url: 'https://api.synthflow.ai/v2/assistants',
							body,
							json: true,
						},
					);

					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData as any),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				} else if (operation === 'getAgent') {
					const agentModelId = this.getNodeParameter('agentModelId', i) as string;

					const responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'synthflowApi',
						{
							method: 'GET',
							url: `https://api.synthflow.ai/v2/assistants/${agentModelId}`,
							json: true,
						},
					);

					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData as any),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				} else if (operation === 'listAgents') {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const qs: any = {
						limit,
						offset,
					};

					const responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'synthflowApi',
						{
							method: 'GET',
							url: 'https://api.synthflow.ai/v2/assistants',
							qs,
							json: true,
						},
					);

					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData as any),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				} else if (operation === 'updateAgent') {
					const agentModelId = this.getNodeParameter('agentModelId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i, {}) as any;

					const body: any = {};

					if (updateFields.agentType) {
						body.type = updateFields.agentType;
					}

					if (updateFields.agentName) {
						body.name = updateFields.agentName;
					}

					if (updateFields.description) {
						body.description = updateFields.description;
					}

					if (updateFields.phone_number) {
						body.phone_number = updateFields.phone_number;
					}

					if (updateFields.external_webhook_url) {
						body.external_webhook_url = updateFields.external_webhook_url;
					}

					if (updateFields.inbound_call_webhook_url) {
						body.inbound_call_webhook_url = updateFields.inbound_call_webhook_url;
					}

					if (typeof updateFields.is_recording === 'boolean') {
						body.is_recording = updateFields.is_recording;
					}

					if (
						typeof updateFields.max_duration_duration_seconds === 'number' &&
						updateFields.max_duration_duration_seconds > 0
					) {
						body.max_duration = body.max_duration || {};
						body.max_duration.duration_seconds = updateFields.max_duration_duration_seconds;
					}

					if (typeof updateFields.max_duration_is_enabled === 'boolean') {
						body.max_duration = body.max_duration || {};
						body.max_duration.is_enabled = updateFields.max_duration_is_enabled;
					}

					if (updateFields.agentJson) {
						let parsedAgent: unknown;
						try {
							parsedAgent = JSON.parse(updateFields.agentJson as string);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in Agent JSON field', {
								itemIndex: i,
							});
						}

						if (typeof parsedAgent !== 'object' || parsedAgent === null) {
							throw new NodeOperationError(
								this.getNode(),
								'Agent JSON must be a JSON object',
								{
									itemIndex: i,
								},
							);
						}

						body.agent = parsedAgent;
					}

					if (Object.keys(body).length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'No fields were provided to update the agent',
							{ itemIndex: i },
						);
					}

					const responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'synthflowApi',
						{
							method: 'PUT',
							url: `https://api.synthflow.ai/v2/assistants/${agentModelId}`,
							body,
							json: true,
						},
					);

					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData as any),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				} else if (operation === 'deleteAgent') {
					const agentModelId = this.getNodeParameter('agentModelId', i) as string;

					const responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'synthflowApi',
						{
							method: 'DELETE',
							url: `https://api.synthflow.ai/v2/assistants/${agentModelId}`,
							json: true,
						},
					);

					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData as any),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}

