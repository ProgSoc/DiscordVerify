import { config } from 'dotenv';
config();

const url = `https://discord.com/api/v10/applications/${process.env.DISCORD_CLIENT_ID}/role-connections/metadata`;

const bootstrap = async () => {
  const body = [
    {
      key: 'member',
      type: 7,
      name: 'Member',
      description: 'Member of ProgSoc',
    },
  ];

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const responseData = await response.json();
    console.log(JSON.stringify(responseData, null, 2));
    throw new Error('Failed to push metadata');
  }

  console.log('Success');
};

bootstrap();
