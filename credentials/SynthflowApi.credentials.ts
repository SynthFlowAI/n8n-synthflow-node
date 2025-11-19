import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class SynthflowApi implements ICredentialType {
	name = 'synthflowApi';
	displayName = 'Synthflow API';
	documentationUrl = 'https://docs.synthflow.ai/';
	icon: Icon = 'file:synthflow.svg' as Icon;
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Synthflow API authentication token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.synthflow.ai',
			url: '/v2/assistants',
			method: 'GET',
			qs: {
				limit: 1,
			},
		},
	};
}

