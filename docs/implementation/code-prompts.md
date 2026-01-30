# Code Generation Prompts

AI prompts for generating TradeFolio code. Copy these into Cursor or Claude to bootstrap implementation.

## Table of Contents

1. [YouTube Sync Script](#1-youtube-sync-script)
2. [Offline Database Module](#2-offline-database-module)
3. [Video Upload Function](#3-video-upload-function)
4. [Profile Setup Wizard](#4-profile-setup-wizard)
5. [Stripe Connect Integration](#5-stripe-connect-integration)
6. [GraphQL Resolvers](#6-graphql-resolvers)
7. [Media Processing Pipeline](#7-media-processing-pipeline)
8. [Search Integration](#8-search-integration)

---

## 1. YouTube Sync Script

### Prompt

```markdown
Write a Python script that lets a user authenticate to YouTube (OAuth), fetches the last 10 videos from their uploads playlist, and prints a JSON list with:
- title
- videoId
- description
- duration
- thumbnail URL

Assume no prior setup. Use the Google API client (`google-auth-oauthlib`, `google-api-python-client`).

Script should run standalone (no web server) and guide user through device auth flow.

Requirements:
- Extra comments for learning
- Output as JSON to stdout
- Show easy way to adapt this to store results in a database later
```

### Expected Output Structure

```python
# youtube_sync.py
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import json

# OAuth 2.0 scopes for YouTube Data API
SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']

def authenticate():
    """Guide user through OAuth flow and return credentials."""
    # ... implementation
    
def get_uploads_playlist_id(youtube):
    """Get the user's uploads playlist ID."""
    # ... implementation
    
def fetch_videos(youtube, playlist_id, max_results=10):
    """Fetch recent videos from playlist."""
    # ... implementation

def main():
    credentials = authenticate()
    youtube = build('youtube', 'v3', credentials=credentials)
    
    playlist_id = get_uploads_playlist_id(youtube)
    videos = fetch_videos(youtube, playlist_id)
    
    print(json.dumps(videos, indent=2))

if __name__ == '__main__':
    main()
```

---

## 2. Offline Database Module

### Prompt

```markdown
Write a React Native (TypeScript) code module for an offline-first "Projects" table using WatermelonDB.

Requirements:
- Project has: id, ownerId, title, description, skill tags (array), beforeImage, afterImage, status, createdAt, updatedAt
- Support offline creation/edit, auto-sync when online, and merge logic for collaborative updates
- Include detailed code comments explaining the offline-first patterns

The module should include:
1. Schema definition
2. Model class
3. Basic CRUD operations
4. Sync adapter configuration
```

### Expected Structure

```typescript
// database/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'projects',
      columns: [
        { name: 'owner_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    // ... more tables
  ],
});

// database/models/Project.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, children } from '@nozbe/watermelondb/decorators';

export default class Project extends Model {
  static table = 'projects';
  
  @field('owner_id') ownerId!: string;
  @field('title') title!: string;
  @field('description') description?: string;
  @field('status') status!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}

// database/sync.ts
export async function syncDatabase() {
  // Pull changes from server
  // Push local changes
  // Handle conflicts
}
```

---

## 3. Video Upload Function

### Prompt

```markdown
Write a React Native function for uploading compressed video to S3 using a presigned URL.

Requirements:
- Uses `react-native-compressor` before upload
- Accept S3 URL/token as input, return video URL/path
- Show UX feedback for progress/failure
- Handle network errors gracefully
- Support cancellation

Include TypeScript types and error handling.
```

### Expected Structure

```typescript
// services/mediaUpload.ts
import { Video } from 'react-native-compressor';
import * as FileSystem from 'expo-file-system';

interface UploadOptions {
  localPath: string;
  presignedUrl: string;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
}

interface UploadResult {
  success: boolean;
  remoteUrl?: string;
  error?: string;
}

export async function uploadVideo(options: UploadOptions): Promise<UploadResult> {
  const { localPath, presignedUrl, onProgress, onError } = options;
  
  try {
    // Step 1: Compress video
    const compressedPath = await Video.compress(localPath, {
      compressionMethod: 'auto',
      maxSize: 1920,
    });
    
    // Step 2: Upload to S3
    const uploadResult = await FileSystem.uploadAsync(
      presignedUrl,
      compressedPath,
      {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          'Content-Type': 'video/mp4',
        },
      }
    );
    
    if (uploadResult.status === 200) {
      return {
        success: true,
        remoteUrl: presignedUrl.split('?')[0],
      };
    }
    
    throw new Error(`Upload failed with status ${uploadResult.status}`);
  } catch (error) {
    onError?.(error as Error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
```

---

## 4. Profile Setup Wizard

### Prompt

```markdown
Create a React Native multi-step profile setup wizard with the following steps:

1. Basic Info (name, email, avatar upload)
2. Trade Selection (dropdown + specialty text)
3. Skills Selection (multi-select from taxonomy)
4. Location (city/state with privacy toggle)
5. Review & Submit

Requirements:
- Use React Navigation for step management
- Persist progress locally (can resume if app closes)
- Validate each step before proceeding
- Show progress indicator
- TypeScript with proper types
- Use React Hook Form for form management
```

### Expected Structure

```typescript
// screens/ProfileSetup/index.tsx
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export function ProfileSetupNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BasicInfo" component={BasicInfoScreen} />
      <Stack.Screen name="TradeSelection" component={TradeSelectionScreen} />
      <Stack.Screen name="SkillsSelection" component={SkillsSelectionScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
    </Stack.Navigator>
  );
}

// screens/ProfileSetup/BasicInfoScreen.tsx
export function BasicInfoScreen({ navigation }) {
  const { control, handleSubmit, formState } = useForm<BasicInfoData>();
  
  const onSubmit = async (data: BasicInfoData) => {
    await saveProgress('basicInfo', data);
    navigation.navigate('TradeSelection');
  };
  
  return (
    <View>
      <ProgressIndicator current={1} total={5} />
      <Controller
        control={control}
        name="fullName"
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextInput
            placeholder="Full Name"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      {/* More fields... */}
      <Button title="Next" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
```

---

## 5. Stripe Connect Integration

### Prompt

```markdown
Write a NestJS service for Stripe Connect Express integration with the following capabilities:

1. Create connected accounts for contractors
2. Generate onboarding links
3. Handle webhooks for account updates
4. Create payment intents
5. Transfer funds to connected accounts

Requirements:
- TypeScript with proper error handling
- Webhook signature verification
- Idempotency keys for payments
- Comprehensive logging
```

### Expected Structure

```typescript
// payments/stripe-connect.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeConnectService {
  private stripe: Stripe;
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  
  async createConnectedAccount(userId: string, email: string) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      email,
      metadata: { userId },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    
    return account;
  }
  
  async createOnboardingLink(accountId: string) {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.APP_URL}/stripe/refresh`,
      return_url: `${process.env.APP_URL}/stripe/complete`,
      type: 'account_onboarding',
    });
    
    return accountLink.url;
  }
  
  async createPaymentIntent(
    amount: number,
    projectId: string,
    idempotencyKey: string
  ) {
    return this.stripe.paymentIntents.create(
      {
        amount,
        currency: 'usd',
        metadata: { projectId },
      },
      { idempotencyKey }
    );
  }
  
  async transferToConnectedAccount(
    amount: number,
    destinationAccountId: string,
    transferGroup: string
  ) {
    return this.stripe.transfers.create({
      amount,
      currency: 'usd',
      destination: destinationAccountId,
      transfer_group: transferGroup,
    });
  }
}
```

---

## 6. GraphQL Resolvers

### Prompt

```markdown
Write NestJS GraphQL resolvers for the TradeFolio User and Project types.

Requirements:
- Use code-first approach with decorators
- Implement queries: getProfile, searchProfiles, getProject, getFeed
- Implement mutations: updateProfile, createProject, publishProject
- Add authentication guards
- Include DataLoader for N+1 prevention
- TypeScript with proper types
```

### Expected Structure

```typescript
// graphql/resolvers/user.resolver.ts
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private projectLoader: ProjectLoader,
  ) {}
  
  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: JwtPayload) {
    return this.userService.findById(user.sub);
  }
  
  @Query(() => User, { nullable: true })
  async getProfile(@Args('userId') userId: string) {
    return this.userService.findById(userId);
  }
  
  @ResolveField(() => [Project])
  async portfolio(@Parent() user: User) {
    // Use DataLoader to prevent N+1
    return this.projectLoader.loadByUserId(user.id);
  }
  
  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Args('input') input: UpdateProfileInput,
  ) {
    return this.userService.update(user.sub, input);
  }
}
```

---

## 7. Media Processing Pipeline

### Prompt

```markdown
Write an AWS Lambda function (Node.js/TypeScript) that:

1. Triggers on S3 upload to the ingest bucket
2. Submits a MediaConvert job for video transcoding
3. Generates HLS outputs at 360p, 720p, 1080p
4. Creates a thumbnail and blur hash
5. Updates the database with processed URLs
6. Sends a notification when complete

Requirements:
- Proper error handling and retries
- CloudWatch logging
- Cost-efficient job settings
```

### Expected Structure

```typescript
// lambda/processMedia.ts
import { S3Event, Handler } from 'aws-lambda';
import { MediaConvertClient, CreateJobCommand } from '@aws-sdk/client-mediaconvert';
import { Client } from 'pg';

const mediaConvert = new MediaConvertClient({ region: process.env.AWS_REGION });

export const handler: Handler<S3Event> = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key);
    
    console.log(`Processing: s3://${bucket}/${key}`);
    
    try {
      // Create MediaConvert job
      const job = await mediaConvert.send(new CreateJobCommand({
        Role: process.env.MEDIACONVERT_ROLE,
        Settings: {
          Inputs: [{
            FileInput: `s3://${bucket}/${key}`,
            // ... input settings
          }],
          OutputGroups: [
            // HLS output group
            {
              Name: 'HLS',
              OutputGroupSettings: {
                Type: 'HLS_GROUP_SETTINGS',
                HlsGroupSettings: {
                  Destination: `s3://${process.env.OUTPUT_BUCKET}/hls/`,
                  SegmentLength: 6,
                },
              },
              Outputs: [
                createHlsOutput('360p', 640, 360, 800000),
                createHlsOutput('720p', 1280, 720, 2500000),
                createHlsOutput('1080p', 1920, 1080, 5000000),
              ],
            },
            // Thumbnail output
            {
              Name: 'Thumbnails',
              // ... thumbnail settings
            },
          ],
        },
      }));
      
      console.log(`MediaConvert job created: ${job.Job?.Id}`);
    } catch (error) {
      console.error('Processing failed:', error);
      throw error;
    }
  }
};

function createHlsOutput(name: string, width: number, height: number, bitrate: number) {
  return {
    NameModifier: `_${name}`,
    VideoDescription: {
      Width: width,
      Height: height,
      CodecSettings: {
        Codec: 'H_264',
        H264Settings: {
          Bitrate: bitrate,
          RateControlMode: 'CBR',
        },
      },
    },
  };
}
```

---

## 8. Search Integration

### Prompt

```markdown
Write a TypeScript service for Typesense search integration with the following features:

1. Index users with skills, location, and verification status
2. Index projects with skills, location, and media
3. Implement fuzzy skill matching (e.g., "tig" matches "TIG Welding")
4. Geo-search for nearby profiles
5. Faceted filtering by trade, experience, verification

Requirements:
- Batch indexing for initial sync
- Real-time updates via webhooks
- Search result highlighting
- Proper TypeScript types
```

### Expected Structure

```typescript
// search/typesense.service.ts
import Typesense from 'typesense';

export class TypesenseService {
  private client: Typesense.Client;
  
  constructor() {
    this.client = new Typesense.Client({
      nodes: [{ host: process.env.TYPESENSE_HOST, port: 443, protocol: 'https' }],
      apiKey: process.env.TYPESENSE_API_KEY,
    });
  }
  
  async createCollections() {
    await this.client.collections().create({
      name: 'profiles',
      fields: [
        { name: 'fullName', type: 'string' },
        { name: 'tradeCategory', type: 'string', facet: true },
        { name: 'skills', type: 'string[]', facet: true },
        { name: 'yearsExperience', type: 'int32', facet: true },
        { name: 'isVerified', type: 'bool', facet: true },
        { name: 'location', type: 'geopoint' },
      ],
    });
  }
  
  async searchProfiles(query: string, filters: SearchFilters) {
    return this.client.collections('profiles').documents().search({
      q: query,
      query_by: 'fullName,skills',
      filter_by: this.buildFilterString(filters),
      sort_by: filters.location 
        ? `location(${filters.location.lat}, ${filters.location.lng}):asc`
        : '_text_match:desc',
      per_page: filters.limit || 20,
    });
  }
  
  private buildFilterString(filters: SearchFilters): string {
    const conditions: string[] = [];
    
    if (filters.tradeCategory) {
      conditions.push(`tradeCategory:=${filters.tradeCategory}`);
    }
    if (filters.minExperience) {
      conditions.push(`yearsExperience:>=${filters.minExperience}`);
    }
    if (filters.verifiedOnly) {
      conditions.push('isVerified:=true');
    }
    if (filters.location && filters.radiusMiles) {
      const radiusKm = filters.radiusMiles * 1.60934;
      conditions.push(
        `location:(${filters.location.lat}, ${filters.location.lng}, ${radiusKm} km)`
      );
    }
    
    return conditions.join(' && ');
  }
}
```

---

## Usage Tips

1. **Customize for your stack**: Adjust frameworks and libraries to match your actual setup
2. **Add context**: Tell the AI about existing code when asking for integrations
3. **Request tests**: Ask for unit tests alongside implementation
4. **Iterate**: Use follow-up prompts to refine the generated code
5. **Review carefully**: AI-generated code needs human review for security and best practices

---

*See [Feature Prompts](./feature-prompts.md) for comprehensive feature specifications.*
