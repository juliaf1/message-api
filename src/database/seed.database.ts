import { DynamoDBService } from '../config/database.config';
import {
  DynamoDBClient,
  PutItemCommand,
  ListTablesCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  const dbService = new DynamoDBService();
  const client = dbService.getClient();

  const tableName = 'messages';

  try {
    const tables = await client.send(new ListTablesCommand({}));
    const tableExists = tables.TableNames?.includes(tableName);

    if (tableExists) {
      try {
        const tableDesc = await client.send(
          new DescribeTableCommand({ TableName: tableName }),
        );

        console.log(
          `Table ${tableName} exists with status: ${tableDesc.Table?.TableStatus}`,
        );

        if (tableDesc.Table?.TableStatus === 'ACTIVE') {
          await insertSampleData(client, tableName);
        }
      } catch (describeError: any) {
        console.error('Error finding table:', describeError);
      }
    } else {
      console.error(`Table ${tableName} does not exist`);
    }
  } catch (error) {
    console.error('Seed operation failed:', error);
    throw error;
  }
}

async function insertSampleData(client: DynamoDBClient, tableName: string) {
  console.log('Inserting sample data...');

  const userOneId = uuidv4();
  const userTwoId = uuidv4();
  const messageOneId = uuidv4();
  const messageTwoId = uuidv4();
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  const messageOneTimestamp = Date.now();
  const messageTwoTimestamp = Date.now() + 200000;

  const items = [
    {
      pk: { S: `USER#${userOneId}` },
      sk: { S: 'PROFILE' },
      gsi1pk: { S: 'USER#juliafrederico@usp.br' },
      gsi1sk: { S: `USER#${userOneId}` },
      external_id: { S: 'juliafrederico@usp.br' },
      user_id: { S: `${userOneId}` },
    },
    {
      pk: { S: `USER#${userTwoId}` },
      sk: { S: 'PROFILE' },
      gsi1pk: { S: 'USER#40044828' },
      gsi1sk: { S: `USER#${userTwoId}` },
      external_id: { S: '40044828' },
      user_id: { S: `${userTwoId}` },
    },
    {
      pk: { S: `MESSAGE#${formattedDate}` },
      sk: {
        S: `MESSAGE#${messageOneTimestamp}#${messageOneId}`,
      },
      gsi1pk: {
        S: `SENDER#${userOneId}`,
      },
      gsi1sk: {
        S: `MESSAGE#${messageOneTimestamp}#${messageOneId}`,
      },
      gsi2pk: { S: `MESSAGE#${messageOneId}` },
      gsi2sk: { S: `MESSAGE#${messageOneId}` },
      content: { S: 'Oi' },
      message_id: { S: messageOneId },
      sender_id: { S: userOneId },
      created_at: { S: new Date(messageOneTimestamp).toISOString() },
      updated_at: { S: new Date(messageOneTimestamp).toISOString() },
      status: { S: 'SEEN' },
      recipient_phone_number: { S: '40044828' },
    },
    {
      pk: { S: `MESSAGE#${formattedDate}` },
      sk: {
        S: `MESSAGE#${messageTwoTimestamp}#${messageTwoId}#STATUS`,
      },
      gsi1pk: {
        S: `SENDER#${userTwoId}`,
      },
      gsi1sk: {
        S: `MESSAGE#${messageTwoTimestamp}#${messageTwoId}`,
      },
      gsi2pk: { S: `MESSAGE#${messageTwoId}` },
      gsi2sk: { S: `MESSAGE#${messageTwoId}` },
      content: { S: 'Oi, tudo bem?' },
      message_id: { S: messageTwoId },
      sender_id: { S: userTwoId },
      created_at: { S: new Date(messageOneTimestamp).toISOString() },
      updated_at: { S: new Date(messageOneTimestamp).toISOString() },
      status: { S: 'SENT' },
      recipient_phone_number: { S: '40044828' },
    },
  ];

  for (const item of items) {
    try {
      await client.send(
        new PutItemCommand({
          TableName: tableName,
          Item: item,
        }),
      );
      console.log(`Inserted item: ${item.pk.S} ${item.sk.S}`);
    } catch (error) {
      console.error(`Error inserting item ${item.sk.S}:`, error);
    }
  }
}

seed().catch(console.error);
