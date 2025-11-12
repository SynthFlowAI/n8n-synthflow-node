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
						name: 'Make a Call',
						value: 'makeCall',
						description: 'Initiate a phone call using Synthflow AI agent',
						action: 'Make a call',
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
						description: 'The customer\'s time zone that can be used to book an appointment',
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
					{
						displayName: 'Greeting',
						name: 'greeting',
						type: 'string',
						default: '',
						placeholder: 'Hello, this is AI assistant calling...',
						description: 'Custom greeting the agent will use when the call is answered',
					},
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

					// Add optional fields if provided
					if (additionalFields.lead_email) {
						body.lead_email = additionalFields.lead_email;
					}

					if (additionalFields.lead_timezone) {
						body.lead_timezone = additionalFields.lead_timezone;
					}

					if (additionalFields.prompt) {
						body.prompt = additionalFields.prompt;
					}

					if (additionalFields.greeting) {
						body.greeting = additionalFields.greeting;
					}

					// Handle custom variables
					if (additionalFields.custom_variables?.variables?.length) {
						body.custom_variables = additionalFields.custom_variables.variables.reduce(
							(acc: any, variable: any) => {
								if (variable.key && variable.value) {
									acc[variable.key] = variable.value;
								}
								return acc;
							},
							{},
						);
					}

					const responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'synthflowApi',
						{
							method: 'POST',
							url: '/v2/calls',
							body,
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

