import { DynamoDBService } from '../config/database.config';
import {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';

async function create() {
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

        // If table is in CREATING state, wait for it to be ACTIVE
        if (tableDesc.Table?.TableStatus === 'CREATING') {
          console.log('Table is being created, waiting...');
          await waitForTableActive(client, tableName);
        } else if (tableDesc.Table?.TableStatus === 'ACTIVE') {
          console.log('Table is already active and ready to use');
        }
      } catch (describeError: any) {
        console.error('Error describing table:', describeError);
      }
    } else {
      // Create the table since it doesn't exist
      await createTable(client, tableName);
    }
  } catch (error) {
    console.error('Create operation failed:', error);
    throw error;
  }
}

async function createTable(client: DynamoDBClient, tableName: string) {
  try {
    console.log(`Creating table: ${tableName}`);

    await client.send(
      new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [
          { AttributeName: 'pk', AttributeType: 'S' },
          { AttributeName: 'sk', AttributeType: 'S' },
          { AttributeName: 'gsi1pk', AttributeType: 'S' },
          { AttributeName: 'gsi1sk', AttributeType: 'S' },
          { AttributeName: 'gsi2pk', AttributeType: 'S' },
          { AttributeName: 'gsi2sk', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },
          { AttributeName: 'sk', KeyType: 'RANGE' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsi1',
            KeySchema: [
              { AttributeName: 'gsi1pk', KeyType: 'HASH' },
              { AttributeName: 'gsi1sk', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
              ReadCapacityUnits: 4,
              WriteCapacityUnits: 4,
            },
          },
          {
            IndexName: 'gsi2',
            KeySchema: [
              { AttributeName: 'gsi2pk', KeyType: 'HASH' },
              { AttributeName: 'gsi2sk', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
              ReadCapacityUnits: 4,
              WriteCapacityUnits: 4,
            },
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 4,
          WriteCapacityUnits: 4,
        },
      }),
    );

    console.log(`Table ${tableName} creation initiated`);
    await waitForTableActive(client, tableName);
    console.log(`Table ${tableName} is now active`);
  } catch (err: any) {
    if (
      err &&
      typeof err === 'object' &&
      'name' in err &&
      (err as { name: string }).name === 'ResourceInUseException'
    ) {
      console.log(
        `Table ${tableName} already exists (caught ResourceInUseException)`,
      );
      await waitForTableActive(client, tableName);
    } else {
      console.error('Error creating table:', err);
      throw err;
    }
  }
}

async function waitForTableActive(
  client: DynamoDBClient,
  tableName: string,
  maxWaitTime: number = 30000,
) {
  const startTime = Date.now();
  const pollInterval = 1000;

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const tableDesc = await client.send(
        new DescribeTableCommand({ TableName: tableName }),
      );

      if (tableDesc.Table?.TableStatus === 'ACTIVE') {
        return;
      }

      console.log(`Table status: ${tableDesc.Table?.TableStatus}, waiting...`);
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error('Error checking table status:', error);
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }

  throw new Error(
    `Table ${tableName} did not become active within ${maxWaitTime}ms`,
  );
}

create().catch(console.error);
