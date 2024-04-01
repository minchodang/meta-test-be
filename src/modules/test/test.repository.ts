import { v4 as uuidv4 } from "uuid";
import { Injectable, Inject } from "@nestjs/common";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { calculateScoreAndCorrectWords } from "src/core/functions/calculate-score-and-correct-words";

@Injectable()
export class TestRepository {
  private tableName: string;
  constructor(@Inject("DYNAMODB") private dynamoDb: DynamoDBDocument) {
    const env = process.env.NODE_ENV;
    this.tableName = (env === "dev" ? "Dev_" : "") + "UserInfoTest";
  }

  async getTestWords(lang: string): Promise<any> {
    try {
      const env = process.env.NODE_ENV;
      const tableName = (env === "dev" ? "Dev_" : "") + "Word";
      const result = await this.dynamoDb.query({
        TableName: tableName,
        KeyConditionExpression: "Id = :id",
        ExpressionAttributeValues: {
          ":id": lang,
        },
      });

      return result.Items;
    } catch (error) {
      console.error("Error querying DynamoDB:", error);
      throw error;
    }
  }

  async createTest(data: any): Promise<any> {
    let id = data.Id;

    if (!id) {
      id = uuidv4();
    }

    const testResult = calculateScoreAndCorrectWords(data);
    const createdAt = new Date().toISOString();
    const category = "test";
    const item = {
      Id: id,
      SortKey: `Test#${createdAt}`,
      ...data,
      ...testResult,
      category,
      createdAt,
    };

    await this.dynamoDb.put({
      TableName: this.tableName,
      Item: item,
    });

    return item;
  }
}