import { IExecuteFunctions } from "n8n-workflow";
import { Synthflow } from "../nodes/Synthflow/Synthflow.node";

describe("Synthflow Node", () => {
  let node: Synthflow;
  let mockExecuteFunctions: Partial<IExecuteFunctions>;

  beforeEach(() => {
    node = new Synthflow();
    mockExecuteFunctions = {
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNodeParameter: jest.fn(),
      helpers: {
        httpRequestWithAuthentication: jest.fn(),
        constructExecutionMetaData: jest.fn().mockReturnValue([]),
        returnJsonArray: jest.fn().mockImplementation((data) => data),
      } as any,
      continueOnFail: jest.fn().mockReturnValue(false),
      getNode: jest.fn().mockReturnValue({}),
    };
  });

  describe("makeCall", () => {
    it("should make a call with correct parameters", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockReturnValueOnce("makeCall") // operation
        .mockReturnValueOnce("model-123") // modelId
        .mockReturnValueOnce("+1234567890") // phone
        .mockReturnValueOnce("John Doe") // name
        .mockReturnValueOnce({}); // additionalFields

      (
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication as jest.Mock
      ).mockResolvedValue({
        success: true,
      });

      await node.execute.call(mockExecuteFunctions as IExecuteFunctions);

      expect(
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication
      ).toHaveBeenCalledWith("synthflowApi", {
        method: "POST",
        url: "https://api.synthflow.ai/v2/calls",
        body: {
          model_id: "model-123",
          phone: "+1234567890",
          name: "John Doe",
        },
        json: true,
      });
    });

    it("should include additional fields if provided", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockReturnValueOnce("makeCall") // operation
        .mockReturnValueOnce("model-123") // modelId
        .mockReturnValueOnce("+1234567890") // phone
        .mockReturnValueOnce("John Doe") // name
        .mockReturnValueOnce({
          lead_email: "john@example.com",
          lead_timezone: "UTC",
          greeting: "Hello",
          custom_variables: {
            variables: [{ key: "var1", value: "val1" }],
          },
        }); // additionalFields

      (
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication as jest.Mock
      ).mockResolvedValue({
        success: true,
      });

      await node.execute.call(mockExecuteFunctions as IExecuteFunctions);

      expect(
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication
      ).toHaveBeenCalledWith(
        "synthflowApi",
        expect.objectContaining({
          body: expect.objectContaining({
            lead_email: "john@example.com",
            lead_timezone: "UTC",
            greeting: "Hello",
            custom_variables: { var1: "val1" },
          }),
        })
      );
    });
  });

  describe("createAgent", () => {
    it("should create an agent with correct parameters", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockReturnValueOnce("createAgent") // operation
        .mockReturnValueOnce("outbound") // agentType
        .mockReturnValueOnce("Test Agent") // agentName
        .mockReturnValueOnce("Prompt") // agent_prompt
        .mockReturnValueOnce("Greeting") // agent_greeting_message
        .mockReturnValueOnce("gpt-4") // agent_llm
        .mockReturnValueOnce("en") // agent_language
        .mockReturnValueOnce("voice-123") // agent_voice_id
        .mockReturnValueOnce({}); // additionalAgentFields

      (
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication as jest.Mock
      ).mockResolvedValue({
        success: true,
      });

      await node.execute.call(mockExecuteFunctions as IExecuteFunctions);

      expect(
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication
      ).toHaveBeenCalledWith("synthflowApi", {
        method: "POST",
        url: "https://api.synthflow.ai/v2/assistants",
        body: {
          type: "outbound",
          name: "Test Agent",
          agent: {
            prompt: "Prompt",
            greeting_message: "Greeting",
            llm: "gpt-4",
            language: "en",
            voice_id: "voice-123",
          },
        },
        json: true,
      });
    });
  });

  describe("getAgent", () => {
    it("should get an agent by modelId", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockReturnValueOnce("getAgent") // operation
        .mockReturnValueOnce("model-123"); // agentModelId

      (
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication as jest.Mock
      ).mockResolvedValue({
        id: "model-123",
      });

      await node.execute.call(mockExecuteFunctions as IExecuteFunctions);

      expect(
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication
      ).toHaveBeenCalledWith("synthflowApi", {
        method: "GET",
        url: "https://api.synthflow.ai/v2/assistants/model-123",
        json: true,
      });
    });
  });

  describe("updateAgent", () => {
    it("should update an agent with provided fields", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockReturnValueOnce("updateAgent") // operation
        .mockReturnValueOnce("model-123") // agentModelId
        .mockReturnValueOnce({
          agentName: "New Name",
          agentType: "inbound",
        }); // updateFields

      (
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication as jest.Mock
      ).mockResolvedValue({
        success: true,
      });

      await node.execute.call(mockExecuteFunctions as IExecuteFunctions);

      expect(
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication
      ).toHaveBeenCalledWith("synthflowApi", {
        method: "PUT",
        url: "https://api.synthflow.ai/v2/assistants/model-123",
        body: {
          name: "New Name",
          type: "inbound",
        },
        json: true,
      });
    });
  });

  describe("deleteAgent", () => {
    it("should delete an agent by modelId", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockReturnValueOnce("deleteAgent") // operation
        .mockReturnValueOnce("model-123"); // agentModelId

      (
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication as jest.Mock
      ).mockResolvedValue({
        success: true,
      });

      await node.execute.call(mockExecuteFunctions as IExecuteFunctions);

      expect(
        mockExecuteFunctions.helpers!.httpRequestWithAuthentication
      ).toHaveBeenCalledWith("synthflowApi", {
        method: "DELETE",
        url: "https://api.synthflow.ai/v2/assistants/model-123",
        json: true,
      });
    });
  });
});
