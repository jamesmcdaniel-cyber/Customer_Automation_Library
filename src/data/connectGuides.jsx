// Step-by-step connection guides, one per AI assistant. Adapted from the Backstory setup
// guides for Claude, ChatGPT, Microsoft Copilot Studio, and Gemini Enterprise.
// Screenshots live in public/assets/connect/<platform>/.

const B = ({ children }) => <strong className="text-ac-dark">{children}</strong>;

const MCP_URL = 'https://mcp.backstory.ai/mcp';

const GEMINI_REGISTER = `curl -X POST https://mcp.backstory.ai/register \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ADMIN_API_SECRET" \\
  -d '{
    "client_name": "Gemini Enterprise MCP Connection",
    "redirect_uris": ["https://vertexaisearch.cloud.google.com/oauth-redirect"],
    "grant_types": ["authorization_code", "refresh_token"],
    "scope": "claudeai"
  }'`;

const GEMINI_DESCRIPTION = `This custom MCP server data store connects to Backstory (People.ai), a
revenue intelligence and AI sales platform. It provides account-level
engagement data, opportunity analysis, scorecard assessments, recent
communication activity, and deal risk signals across a CSM/AE portfolio.
It does NOT support creating or modifying CRM records, sending emails,
updating Salesforce fields, or accessing billing/contract data directly.
---
## Example triggering queries
- Query: What's the account status for Nimbus Robotics?
  Reasoning: User asks for relationship/health overview on a named account.
- Query: What happened with Vantage Retail in the last 30 days?
  Reasoning: Recent activity (emails, calls, meetings) for an account.
- Query: Who have we been talking to at Halden Freight?
  Reasoning: Contact engagement and stakeholder coverage data.
- Query: Show me open opportunities and risk signals for Corvia Health.
  Reasoning: Opportunity status and AI-analyzed deal risks.
- Query: Which of my accounts need attention this week?
  Reasoning: Portfolio-level view via top_records.
- Query: What does SalesAI think about the Nimbus Robotics renewal?
  Reasoning: SalesAI advisory via the ask_sales_ai tools.
- Query: Which of my deals close this quarter?
  Reasoning: A filtered list via preview_records, then fetch_records.`;

const GEMINI_INSTRUCTIONS = `You are a Revenue Intelligence Assistant powered by Backstory (People.ai).
Your primary function is to retrieve, analyze, and summarize account and
opportunity data for a Sales and Customer Success team.
---
## Core behaviors
- Account queries: Call find_account to resolve the account ID, then
  get_account_status for a strategic overview or
  get_recent_account_activity for communication history.
- Opportunity queries: Use find_account first, then get_opportunity_status
  for deal health and risks. Use find_record_by_crm_id if a Salesforce ID
  is available.
- Stakeholder coverage: Use get_engaged_people to surface recent contacts.
- AI advisory: Call ask_sales_ai_about_account or
  ask_sales_ai_about_opportunity when asked what SalesAI recommends.
- Portfolio-level: Use top_records to surface the most relevant accounts.
- Lists: Use preview_records to count matching accounts or deals, confirm
  with the user, then fetch_records with the same request.
- Precedents: Use situation_search to find similar past deals.
- Scorecards: Use get_scorecard or get_opportunity_scorecard.
## Response format
- Lead with a 1-2 sentence executive summary of the key insight.
- Follow with: Status | Recent Activity | Risks/Blockers | Next Steps
- Opportunities: include deal name, amount, close date, and top risk signal.
- Contacts: include name, title, and last activity date.
- Flag stale data: if last activity > 30 days, surface it as a coverage gap.
## Default behavior for ambiguous queries
- Ambiguous account name: call find_account with the partial name and confirm.
- Multiple opportunities: list all active ones and ask the user to confirm.
- No data returned: "I wasn't able to find recent activity for [Account]
  in Backstory. This may indicate limited engagement data or a sync gap."
## Boundaries
- Do not fabricate engagement data, contact names, or deal amounts.
- Do not modify any CRM records. This is a read-only integration.
- Do not speculate on renewal likelihood without Backstory data.
- For pricing, contract terms, or billing: redirect to Salesforce.`;

export const GUIDES = [
  {
    id: 'claude',
    name: 'Claude',
    logo: 'claude.svg',
    setup: 'Each person connects',
    time: 'About 3 minutes',
    summary: 'Add Backstory as a custom connector and sign in. Works on the web, desktop, and mobile.',
    need: [
      'A Claude plan with custom connectors. On Team and Enterprise, an owner may need to allow it first.',
      'Your Backstory sign-in.',
    ],
    steps: [
      {
        title: 'Add a custom connector',
        body: <>Go to <B>Customize → Connectors</B>, select <B>+ Add</B>, and choose <B>Add custom connector</B>.</>,
        image: 'claude/02-add-connector.jpg',
      },
      {
        title: 'Enter the server details',
        body: <>Name it <B>Backstory MCP</B>, paste the server URL, and select <B>Continue</B>.</>,
        fields: [['Remote MCP server URL', MCP_URL]],
        image: 'claude/03-server-details.jpg',
      },
      {
        title: 'Sign in to Backstory',
        body: <>Sign in as you normally do in the window that opens. It closes when you&rsquo;re connected.</>,
        image: 'claude/04-sign-in.jpg',
        narrow: true,
      },
      {
        title: 'Allow the tools',
        body: <>Backstory&rsquo;s 17 tools are all read-only, so it&rsquo;s safe to set them to <B>Always allow</B>.</>,
        image: 'claude/05-tool-permissions.jpg',
      },
      {
        title: 'Use it in a chat',
        body: <>In a new chat, select <B>+</B> in the message box and make sure <B>Backstory MCP</B> is on.</>,
      },
    ],
    troubleshooting: [
      ['No Add custom connector option', 'Your plan doesn’t support custom connectors, or your organization restricts them. Ask your Claude owner to add Backstory.'],
      ['No tools appear', 'Check the URL ends in /mcp with no trailing slash, then remove the connector and add it again.'],
      ['The sign-in window never opens', 'Allow popups for claude.ai, or try a private window.'],
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: 'openai.svg',
    setup: 'Each person connects',
    time: 'About 5 minutes',
    summary: 'Turn on Developer mode, create an app that points at Backstory, and sign in.',
    need: [
      'A paid ChatGPT plan (Plus or higher). Business and Enterprise workspaces may need an admin to allow custom apps.',
      'Your Backstory sign-in.',
    ],
    steps: [
      {
        title: 'Turn on Developer mode',
        body: <>In <B>Settings → Security and login</B>, switch on <B>Developer mode</B>.</>,
        image: 'chatgpt/01-developer-mode.jpg',
      },
      {
        title: 'Create an app',
        body: <>Select <B>Plugins</B> in the sidebar, then the <B>+</B> next to the search box, and choose <B>Create app</B>.</>,
        image: 'chatgpt/03-create-app.jpg',
      },
      {
        title: 'Enter the server details',
        body: <>Name it <B>Backstory MCP</B>, paste the URL, choose <B>OAuth</B>, check the trust box, and select <B>Create</B>.</>,
        fields: [['MCP server URL', MCP_URL]],
      },
      {
        title: 'Sign in to Backstory',
        body: <>Sign in as you normally do in the window that opens. The app then shows as connected.</>,
        image: 'chatgpt/05-sign-in.jpg',
      },
      {
        title: 'Add it to a chat',
        body: <>In a new chat, select <B>Plugins</B> under the message box and pick <B>Backstory MCP</B>.</>,
        image: 'chatgpt/06-add-to-chat.jpg',
      },
    ],
    troubleshooting: [
      ['No Create app option', 'Developer mode is off, or your workspace admin hasn’t allowed custom apps.'],
      ['No tools appear', 'Check the URL ends in /mcp with no trailing slash, then delete the app and create it again.'],
      ['The sign-in window never opens', 'Allow popups for chatgpt.com, or try a private window.'],
    ],
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    logo: 'copilot.svg',
    setup: 'An agent builder sets it up',
    time: 'About 5 minutes',
    summary: 'Add Backstory as an MCP tool on a Copilot Studio agent, then publish it. Each person signs in the first time they use it.',
    need: [
      'A Copilot Studio agent you can edit, in an environment where you can create connections.',
      'Your Backstory sign-in.',
    ],
    steps: [
      {
        title: 'Add an MCP tool',
        body: <>On the agent&rsquo;s <B>Build</B> tab, select <B>+</B> next to <B>Tools</B>, then <B>+ Add → Model Context Protocol (MCP)</B>.</>,
        image: 'copilot/03-mcp.jpg',
      },
      {
        title: 'Enter the server details',
        body: <>Name it <B>Backstory</B>, describe the data it serves, paste the URL, choose <B>OAuth 2.0</B> and <B>Dynamic (with discovery)</B>, then select <B>Add</B>.</>,
        fields: [['Server URL', MCP_URL]],
        image: 'copilot/04-server-details.jpg',
      },
      {
        title: 'Create the connection',
        body: <>Open the <B>Not connected</B> dropdown, select <B>Create new connection</B>, name it, and select <B>Create</B>.</>,
        image: 'copilot/06-create-connection.jpg',
      },
      {
        title: 'Sign in to Backstory',
        body: <>Sign in as you normally do in the window that opens.</>,
        image: 'copilot/08-sign-in.jpg',
      },
      {
        title: 'Add it, test, and publish',
        body: <>Select <B>Add</B>. Test a question in <B>Preview</B>, then publish. Each person signs in with their own Backstory login the first time.</>,
        image: 'copilot/09-connected.jpg',
      },
    ],
    troubleshooting: [
      ['No tools listed under the server', 'Check the URL ends in /mcp and the configuration type is Dynamic (with discovery), then re-add the server.'],
      ['The connection keeps showing “Not connected”', 'Reselect the connection under Tools, save, and refresh the page.'],
      ['The agent answers without Backstory', 'Make the server description specific, and tell the agent in its instructions to use Backstory for account and deal questions.'],
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini Enterprise',
    logo: 'gemini.png',
    setup: 'A Google Cloud admin sets it up',
    time: 'About 15 minutes',
    summary: 'Register Gemini with Backstory, add Backstory as a custom MCP data store in Google Cloud, and tell Gemini when to use it.',
    need: [
      'Access to Gemini Enterprise in Google Cloud Console, with permission to create data stores.',
      'Your Backstory Admin API Secret. Ask your Backstory account team if you don’t have it.',
    ],
    steps: [
      {
        title: 'Register Gemini with Backstory',
        body: <>Run this command with your Admin API Secret, and save the <B>client_id</B> and <B>client_secret</B> it returns. The secret can&rsquo;t be recovered later.</>,
        code: [{ label: 'Terminal', text: GEMINI_REGISTER }],
      },
      {
        title: 'Create the data store',
        body: <>In Google Cloud Console, open <B>Gemini Enterprise → Data stores → Create data store</B>, and choose <B>Custom MCP Server (Preview)</B>.</>,
      },
      {
        title: 'Fill in the authentication settings',
        body: <>Enter these values, select <B>Login</B>, then <B>Continue</B>.</>,
        fields: [
          ['Server URL', 'https://mcp.backstory.ai/mcp'],
          ['Auth type', 'OAuth 2.0 (Authorization Code)'],
          ['Authorization endpoint', 'https://mcp.backstory.ai/authorize'],
          ['Token endpoint', 'https://mcp.backstory.ai/token'],
          ['Client ID and secret', 'From step 1'],
          ['Scope', 'claudeai'],
          ['Redirect URI', 'https://vertexaisearch.cloud.google.com/oauth-redirect'],
        ],
      },
      {
        title: 'Tell Gemini when and how to use Backstory',
        body: <>Paste the description into <B>MCP Server Description</B>. Once the data store is <B>Active</B>, paste the instructions into <B>MCP Agent Instructions</B>.</>,
        code: [
          { label: 'MCP Server Description', text: GEMINI_DESCRIPTION },
          { label: 'MCP Agent Instructions', text: GEMINI_INSTRUCTIONS },
        ],
      },
      {
        title: 'Turn on the tools',
        body: <>No tools are on by default. In the data store, go to <B>Actions</B> and enable the Backstory actions.</>,
      },
    ],
    troubleshooting: [
      ['Gemini ignores Backstory', 'The MCP Server Description is missing or too vague. Paste the one from step 4.'],
      ['Answers come back empty', 'Keep the tool order in the Agent Instructions: find_account has to run first.'],
      ['No tools after setup', 'Go to Actions → Reload custom actions.'],
    ],
  },
  {
    id: 'n8n',
    name: 'n8n',
    logo: 'n8n.svg',
    setup: 'A workflow builder sets it up',
    time: 'About 5 minutes',
    summary: 'Create an MCP credential for Backstory, then give an AI Agent node access to it, so workflows run on real deal activity.',
    need: [
      'An n8n instance (Cloud or self-hosted) where you can create credentials.',
      'Your Backstory sign-in. Every workflow using the credential sees what your Backstory user can see.',
    ],
    steps: [
      {
        title: 'Create a credential',
        body: <>On the <B>Overview</B> page, select the <B>Credentials</B> tab, then <B>Create credential</B>.</>,
        image: 'n8n/01-create-credential.jpg',
      },
      {
        title: 'Choose MCP OAuth2 API',
        body: <>Search for <B>MCP OAuth2 API</B> and select it. A generic OAuth2 or HTTP credential won&rsquo;t work.</>,
        image: 'n8n/02-mcp-oauth2.jpg',
      },
      {
        title: 'Enter the server details',
        body: <>Name the credential <B>Backstory MCP</B>, turn on <B>Use Dynamic Client Registration</B>, paste the server URL, and leave the redirect URL as shown. Then select <B>Connect</B>.</>,
        fields: [['Server URL', MCP_URL]],
        image: 'n8n/03-server-details.jpg',
      },
      {
        title: 'Sign in and save',
        body: <>Sign in as you normally do in the window that opens. When the banner turns green, select <B>Save</B>.</>,
        image: 'n8n/04-sign-in.jpg',
        narrow: true,
      },
      {
        title: 'Use it in a workflow',
        body: <>Add an <B>AI Agent</B> node and attach an <B>MCP Client Tool</B>. Set the endpoint to the server URL, choose <B>MCP OAuth2 API</B>, and pick your Backstory credential. Include all tools, or only the ones the workflow needs.</>,
      },
    ],
    troubleshooting: [
      ['MCP OAuth2 API isn’t in the list', 'Your n8n version is too old, or your role can’t create credentials. Update n8n, or ask your instance admin.'],
      ['Connect fails', 'Check the URL ends in /mcp with no trailing slash and Use Dynamic Client Registration is on, then retry.'],
      ['It worked, then started failing', 'The sign-in expired. Open the credential, select Connect again, and save.'],
    ],
  },
];

export const findGuide = (id) => GUIDES.find((g) => g.id === id);
